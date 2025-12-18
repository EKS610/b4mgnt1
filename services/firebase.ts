import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { Visitor, VisitorStatus } from '../types';

// Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrZzZNwtna3ULThZHj7my3Wr0uMAWJF5s",
  authDomain: "b4mngt.firebaseapp.com",
  projectId: "b4mngt",
  storageBucket: "b4mngt.firebasestorage.app",
  messagingSenderId: "892898486798",
  appId: "1:892898486798:web:d1629ca52736c97c536a5f",
  measurementId: "G-9BZY2SF3LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection Reference
const visitorsCollection = collection(db, "visitors");

/**
 * Subscribe to real-time updates from the visitors collection
 */
export const subscribeToVisitors = (onUpdate: (visitors: Visitor[]) => void) => {
  // Order by createdAt desc (newest first)
  const q = query(visitorsCollection, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const visitors = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Helper to safely convert Firestore timestamps to display strings
      const formatTime = (ts: any) => {
        if (!ts) return undefined;
        // Handle Firestore Timestamp object
        if (ts.toDate && typeof ts.toDate === 'function') {
           return ts.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        // Handle string/number/Date
        return new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      };

      return {
        id: doc.id,
        ...data,
        // Override checkInTime with formatted version if it exists as a Timestamp
        checkInTime: data.checkInTime ? (typeof data.checkInTime === 'string' ? data.checkInTime : formatTime(data.createdAt)) : undefined
      } as Visitor;
    });
    onUpdate(visitors);
  }, (error) => {
    console.error("Error subscribing to visitors:", error);
    // In case of permission errors or others, we don't crash the app, just log
  });
};

/**
 * Add a new visitor to Firestore
 */
export const addVisitorToStore = async (visitor: Omit<Visitor, 'id'>) => {
  try {
    await addDoc(visitorsCollection, {
      ...visitor,
      createdAt: serverTimestamp() 
    });
  } catch (error) {
    console.error("Error adding visitor:", error);
    throw error;
  }
};

/**
 * Update visitor status
 */
export const updateVisitorStatus = async (id: string, status: VisitorStatus) => {
  try {
    const visitorRef = doc(db, "visitors", id);
    const updates: any = { status };
    
    // Set checkout time if checking out
    if (status === VisitorStatus.CHECKED_OUT) {
      updates.checkOutTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // Set checkin time if approving
    if (status === VisitorStatus.CHECKED_IN) {
       updates.checkInTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    await updateDoc(visitorRef, updates);
  } catch (error) {
    console.error("Error updating visitor status:", error);
    throw error;
  }
};
