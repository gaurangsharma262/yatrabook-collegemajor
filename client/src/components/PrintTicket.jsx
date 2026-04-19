import { useRef } from 'react';
import { IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoPrintOutline } from 'react-icons/io5';
import { formatPrice, formatTime, formatDate } from '../lib/utils';

const transportIcons = { train: IoTrainOutline, flight: IoAirplaneOutline, bus: IoBusOutline };

export default function PrintTicket({ booking, transport, type, travelDate, selectedClass, passengers }) {
  const ticketRef = useRef(null);
  const Icon = transportIcons[type] || IoTrainOutline;
  const transportName = transport?.name || transport?.airline || transport?.operator;
  const transportNumber = transport?.trainNumber || transport?.flightNumber || transport?.busId;

  const handlePrint = () => {
    const printContent = ticketRef.current;
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>YatraBook Ticket - ${booking.pnr}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8f9fa; padding: 20px; color: #1a1a2e; }
          .ticket { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .ticket-header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 24px 32px; }
          .ticket-header h1 { font-family: 'Poppins', sans-serif; font-size: 24px; margin-bottom: 4px; }
          .ticket-header p { opacity: 0.85; font-size: 13px; }
          .ticket-body { padding: 28px 32px; }
          .journey { display: flex; align-items: center; gap: 20px; margin: 20px 0; padding: 20px; background: #f8f9ff; border-radius: 12px; }
          .journey .city { text-align: center; min-width: 100px; }
          .journey .city .time { font-size: 22px; font-weight: 700; color: #1a1a2e; }
          .journey .city .name { font-size: 13px; color: #666; margin-top: 4px; }
          .journey .line { flex: 1; height: 2px; background: linear-gradient(to right, #667eea, #764ba2); position: relative; }
          .journey .line .dur { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #f8f9ff; padding: 0 8px; font-size: 11px; color: #888; white-space: nowrap; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
          .info-item { padding: 12px 16px; background: #f8f9fa; border-radius: 10px; }
          .info-item .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
          .info-item .value { font-size: 15px; font-weight: 600; margin-top: 4px; }
          .pnr-box { text-align: center; padding: 16px; background: linear-gradient(135deg, #667eea15, #764ba215); border: 2px dashed #667eea40; border-radius: 12px; margin: 20px 0; }
          .pnr-box .label { font-size: 12px; color: #888; text-transform: uppercase; }
          .pnr-box .pnr { font-size: 28px; font-family: 'Courier New', monospace; font-weight: 700; color: #667eea; letter-spacing: 3px; margin-top: 4px; }
          .passengers { margin: 20px 0; }
          .passengers h3 { font-size: 14px; color: #333; margin-bottom: 12px; font-weight: 600; }
          .passengers table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .passengers th { text-align: left; padding: 8px 12px; background: #f8f9fa; color: #666; font-weight: 500; border-radius: 6px; }
          .passengers td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; }
          .ticket-footer { padding: 16px 32px; background: #f8f9fa; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
          .status-confirmed { color: #00d4aa; font-weight: 600; }
          .status-waitlisted { color: #ffbe0b; font-weight: 600; }
          .amount { font-size: 20px; font-weight: 700; color: #667eea; }
          @media print { body { padding: 0; background: white; } .ticket { box-shadow: none; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>YatraBook</h1>
            <p>E-Ticket / Boarding Pass</p>
          </div>
          <div class="ticket-body">
            <div class="pnr-box">
              <div class="label">PNR Number</div>
              <div class="pnr">${booking.pnr}</div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="label">${type === 'train' ? 'Train' : type === 'flight' ? 'Flight' : 'Bus'}</div>
                <div class="value">${transportName}</div>
              </div>
              <div class="info-item">
                <div class="label">Number</div>
                <div class="value">${transportNumber}</div>
              </div>
              <div class="info-item">
                <div class="label">Travel Date</div>
                <div class="value">${travelDate}</div>
              </div>
              <div class="info-item">
                <div class="label">Class</div>
                <div class="value">${selectedClass?.name || booking.className}</div>
              </div>
            </div>

            <div class="journey">
              <div class="city">
                <div class="time">${transport?.departure || '--:--'}</div>
                <div class="name">${transport?.source?.city || ''}</div>
              </div>
              <div class="line">
                <span class="dur">${transport?.duration || ''}</span>
              </div>
              <div class="city">
                <div class="time">${transport?.arrival || '--:--'}</div>
                <div class="name">${transport?.destination?.city || ''}</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="label">Booking ID</div>
                <div class="value" style="font-family: monospace;">${booking.bookingId}</div>
              </div>
              <div class="info-item">
                <div class="label">Status</div>
                <div class="value status-${booking.bookingStatus}">${booking.bookingStatus.toUpperCase()}</div>
              </div>
            </div>

            <div class="passengers">
              <h3>Passengers</h3>
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th></tr>
                </thead>
                <tbody>
                  ${(passengers || []).map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>

            <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 2px dashed #eee;">
              <div class="label" style="font-size: 12px; color: #888;">Total Amount Paid</div>
              <div class="amount">${formatPrice(booking.totalAmount)}</div>
            </div>
          </div>
          <div class="ticket-footer">
            This is a computer-generated ticket and does not require a signature. &bull; YatraBook &copy; ${new Date().getFullYear()}
          </div>
        </div>
        <div class="no-print" style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 24px; background:#667eea; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;">Print Ticket</button>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="btn-secondary flex items-center gap-2"
    >
      <IoPrintOutline size={18} />
      Print Ticket
    </button>
  );
}
