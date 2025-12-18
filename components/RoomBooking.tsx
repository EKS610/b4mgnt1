import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Check, X, Users, DollarSign, FileText, Plus, AlertCircle, Trash2, Info, CheckCircle2, User } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  baseRate: number;
}

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  customerName: string;
  date: string;
  time: string;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
}

export const RoomBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings' | 'reports'>('rooms');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Generate 50 Rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const roomNum = i + 1;
      let capacity = 4;
      let baseRate = 500;
      let status: Room['status'] = 'available';

      if (roomNum <= 10) {
        capacity = 20;
        baseRate = 2000;
      } else if (roomNum <= 30) {
        capacity = 10;
        baseRate = 1000;
      }

      if (roomNum === 2 || roomNum === 15 || roomNum === 23) status = 'occupied';
      if (roomNum === 50) status = 'maintenance';

      return {
        id: `${roomNum}`,
        name: `Room ${roomNum}`,
        capacity,
        status,
        baseRate
      };
    });
  });

  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'B001', roomId: '2', roomName: 'Room 2', customerName: 'Acme Corp', date: '2023-10-25', time: '10:00', totalAmount: 1000, advanceAmount: 500, balanceAmount: 500, status: 'Confirmed' },
    { id: 'B002', roomId: '15', roomName: 'Room 15', customerName: 'Global Tech', date: '2023-10-25', time: '11:30', totalAmount: 1200, advanceAmount: 1200, balanceAmount: 0, status: 'Confirmed' },
    { id: 'B003', roomId: '23', roomName: 'Room 23', customerName: 'StartUp Inc', date: '2023-10-25', time: '14:00', totalAmount: 800, advanceAmount: 200, balanceAmount: 600, status: 'Confirmed' }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    roomId: '',
    customerName: '',
    date: '',
    time: '',
    totalAmount: 0,
    advanceAmount: 0
  });

  const handleOpenBooking = (roomId?: string) => {
    const selectedRoom = roomId ? rooms.find(r => r.id === roomId) : null;
    setFormData({
      roomId: roomId || rooms.filter(r => r.status === 'available')[0]?.id || '',
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      totalAmount: selectedRoom ? selectedRoom.baseRate : 0,
      advanceAmount: 0
    });
    setIsModalOpen(true);
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    const room = rooms.find(r => r.id === rId);
    setFormData({
      ...formData,
      roomId: rId,
      totalAmount: room ? room.baseRate : 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) return;

    const room = rooms.find(r => r.id === formData.roomId);
    if (!room) return;

    const newBooking: Booking = {
      id: `B${Date.now()}`,
      roomId: formData.roomId,
      roomName: room.name,
      customerName: formData.customerName,
      date: formData.date,
      time: formData.time,
      totalAmount: Number(formData.totalAmount),
      advanceAmount: Number(formData.advanceAmount),
      balanceAmount: Number(formData.totalAmount) - Number(formData.advanceAmount),
      status: 'Confirmed'
    };

    setBookings([newBooking, ...bookings]);
    setRooms(rooms.map(r => r.id === formData.roomId ? { ...r, status: 'occupied' } : r));
    setIsModalOpen(false);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (confirm('Are you sure you want to cancel this booking? The room will be made available again.')) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      setRooms(rooms.map(r => r.id === booking.roomId ? { ...r, status: 'available' } : r));
      setIsManageModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const completeBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
    setRooms(rooms.map(r => r.id === booking.roomId ? { ...r, status: 'available' } : r));
    setIsManageModalOpen(false);
    setSelectedBooking(null);
  };

  const handleManageOccupied = (roomId: string) => {
    const booking = bookings.find(b => b.roomId === roomId && b.status === 'Confirmed');
    if (booking) {
      setSelectedBooking(booking);
      setIsManageModalOpen(true);
    }
  };

  // Report Calculations
  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalAdvance = activeBookings.reduce((sum, b) => sum + b.advanceAmount, 0);
  const totalPending = activeBookings.reduce((sum, b) => sum + b.balanceAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Room Booking Management</h2>
          <p className="text-slate-500">Reservations, financials, and occupancy reports.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {(['rooms', 'bookings', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedBooking(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB: ROOMS GRID --- */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span>Available</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div> <span>Occupied</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400"></div> <span>Maintenance</span></div>
             </div>
             <button onClick={() => handleOpenBooking()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200">
               <Plus className="w-4 h-4" />
               <span>New Reservation</span>
             </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition relative">
                <div className={`h-1.5 w-full ${
                  room.status === 'available' ? 'bg-emerald-500' : 
                  room.status === 'occupied' ? 'bg-rose-500' : 'bg-slate-400'
                }`}></div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{room.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${
                      room.status === 'available' ? 'bg-emerald-500' : 
                      room.status === 'occupied' ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'
                    }`}></div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Cap: {room.capacity}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>₹{room.baseRate}/hr</span>
                    </div>
                  </div>

                  {room.status === 'available' ? (
                    <button 
                      onClick={() => handleOpenBooking(room.id)}
                      className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition text-xs border border-emerald-100"
                    >
                      Book Now
                    </button>
                  ) : room.status === 'occupied' ? (
                    <button 
                      onClick={() => handleManageOccupied(room.id)}
                      className="w-full py-2 bg-rose-50 text-rose-700 rounded-lg font-bold hover:bg-rose-600 hover:text-white transition text-xs border border-rose-100 flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      Manage
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-slate-50 text-slate-400 rounded-lg font-bold text-center text-xs border border-slate-100 cursor-not-allowed">
                      Offline
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: BOOKINGS LIST --- */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Recent Bookings
            </h3>
            <span className="text-xs text-slate-400 font-medium">{bookings.length} Total Bookings</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(booking => (
                  <tr 
                    key={booking.id} 
                    className={`transition-colors ${selectedBooking?.id === booking.id ? 'bg-indigo-50/50 ring-1 ring-inset ring-indigo-200' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{booking.id.slice(-4)}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{booking.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{booking.roomName}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-bold text-slate-700">{booking.date}</div>
                      <div className="flex items-center gap-1">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        booking.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                        booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-slate-800">₹{booking.totalAmount}</div>
                      {booking.balanceAmount > 0 ? (
                         <div className="text-[10px] text-rose-500 font-bold">Due: ₹{booking.balanceAmount}</div>
                      ) : (
                         <div className="text-[10px] text-emerald-500 font-bold">Paid</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'Confirmed' && (
                          <>
                            <button 
                              onClick={() => completeBooking(booking.id)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-lg border border-emerald-100 hover:bg-emerald-100 transition flex items-center gap-1"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Checkout
                            </button>
                            <button 
                              onClick={() => cancelBooking(booking.id)}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase rounded-lg border border-rose-100 hover:bg-rose-100 transition flex items-center gap-1"
                              title="Cancel Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="p-12 text-center text-slate-400">
               <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
               <p className="font-medium">No bookings recorded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: REPORTS --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><DollarSign className="w-5 h-5" /></div>
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-slate-800">₹{totalRevenue}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Check className="w-5 h-5" /></div>
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Collected</h3>
              </div>
              <p className="text-3xl font-bold text-slate-800">₹{totalAdvance}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-50 rounded-xl text-rose-600"><AlertCircle className="w-5 h-5" /></div>
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Outstanding</h3>
              </div>
              <p className="text-3xl font-bold text-slate-800">₹{totalPending}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Financial Transaction Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Date</th>
                    <th className="pb-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Room</th>
                    <th className="pb-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Client</th>
                    <th className="pb-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Amount</th>
                    <th className="pb-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.filter(b => b.status !== 'Cancelled').map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-4 text-slate-500">{b.date}</td>
                      <td className="py-4 text-slate-800 font-bold">{b.roomName}</td>
                      <td className="py-4 text-slate-500">{b.customerName}</td>
                      <td className="py-4 text-right">
                        <div className="font-bold text-slate-800">₹{b.totalAmount}</div>
                        <div className="text-[10px] text-emerald-600">Paid: ₹{b.advanceAmount}</div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-4 px-4 rounded-l-xl" colSpan={3}>GRAND TOTALS</td>
                    <td className="py-4 text-right text-indigo-700">₹{totalRevenue}</td>
                    <td className="py-4 text-right px-4 rounded-r-xl"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MANAGE OCCUPIED ROOM --- */}
      {isManageModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                <Info className="w-5 h-5" /> Manage Room Occupancy
              </h2>
              <button onClick={() => setIsManageModalOpen(false)} className="p-1 hover:bg-rose-100 rounded-full transition text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedBooking.customerName}</h3>
                    <p className="text-xs text-slate-500">Active Booking: {selectedBooking.roomName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-100">
                    <span className="block text-slate-400 font-bold uppercase mb-0.5">Time Slot</span>
                    <span className="text-slate-700 font-medium">{selectedBooking.time}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100">
                    <span className="block text-slate-400 font-bold uppercase mb-0.5">Amount Due</span>
                    <span className={`font-bold ${selectedBooking.balanceAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      ₹{selectedBooking.balanceAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <button 
                  onClick={() => completeBooking(selectedBooking.id)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Checkout / Complete
                </button>
                <button 
                  onClick={() => cancelBooking(selectedBooking.id)}
                  className="w-full py-4 bg-white text-rose-600 border border-rose-200 rounded-xl font-bold hover:bg-rose-50 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: NEW RESERVATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">New Reservation</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Room No</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    value={formData.roomId}
                    onChange={handleRoomChange}
                    required
                  >
                    <option value="" disabled>Choose Room...</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id} disabled={r.status !== 'available'}>
                        {r.name} {r.status !== 'available' ? `(${r.status})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Client Name</label>
                   <input 
                     type="text" 
                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                     value={formData.customerName}
                     onChange={e => setFormData({...formData, customerName: e.target.value})}
                     placeholder="Company or Individual"
                     required
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <DollarSign className="w-3 h-3" /> Billing Info
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Total Amount</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                      value={formData.totalAmount}
                      onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Advance</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      value={formData.advanceAmount}
                      onChange={e => setFormData({...formData, advanceAmount: Number(e.target.value)})}
                    />
                  </div>
                   <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Due</label>
                    <div className="w-full p-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold flex items-center">
                       ₹{Math.max(0, formData.totalAmount - formData.advanceAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 transition rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .animate-fade-in {
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
