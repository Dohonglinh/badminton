
export type Booking = {
  startTime: string;  // Giờ bắt đầu (dạng "HH:mm")
  endTime: string;    // Giờ kết thúc (dạng "HH:mm")
};

// Hàm kiểm tra xung đột thời gian
export function isTimeConflict(
  newStart: string,  // Giờ bắt đầu mới (dạng "HH:mm")
  newEnd: string,    // Giờ kết thúc mới (dạng "HH:mm")
  existingBookings: Booking[]  // Danh sách các cuộc đặt sân hiện tại
): boolean {
  // Hàm chuyển đổi thời gian dạng "HH:mm" sang phút kể từ 00:00
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const newStartMin = toMinutes(newStart);  // Chuyển giờ bắt đầu mới sang phút
  let newEndMin = toMinutes(newEnd);      // Chuyển giờ kết thúc mới sang phút

  // Nếu giờ kết thúc nhỏ hơn hoặc bằng giờ bắt đầu, nghĩa là đã sang ngày hôm sau
  if (newEndMin <= newStartMin) {
    newEndMin += 24 * 60;
  }

  // Kiểm tra nếu có cuộc đặt sân nào có thời gian trùng với khoảng thời gian mới
  return existingBookings.some(({ startTime, endTime }) => {
    const existingStart = toMinutes(startTime);  // Chuyển giờ bắt đầu cũ sang phút
    let existingEnd = toMinutes(endTime);      // Chuyển giờ kết thúc cũ sang phút

    if (existingEnd <= existingStart) {
      existingEnd += 24 * 60;
    }

    // Kiểm tra xem có xung đột thời gian không
    // Điều kiện xung đột: mới bắt đầu trùng hoặc vượt qua giờ kết thúc cũ,
    // và mới kết thúc trùng hoặc chưa đến giờ bắt đầu cũ
    return newStartMin < existingEnd && newEndMin > existingStart;
  });
}
