"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import BookingModal from "@/app/user/components/form";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/source/firebaseConfig";
import ChatBot from "@/app/chatbotdemo/chatbot";

type Court = {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
};

export default function BadmintonSchedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectId, setSelectId] = useState<number>(0);
  const [courtsData, setCourtsData] = useState<Court[]>([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courts"));
        const courtsList: Court[] = snapshot.docs.map((doc) => {
          const idAsNumber = Number(doc.id);
          if (isNaN(idAsNumber)) {
            throw new Error(`ID sân không hợp lệ: ${doc.id}`);
          }

          const data = doc.data();
          return {
            id: idAsNumber,
            name: data.name,
            type: data.type,
            price: data.price,
            image: data.image,
          };
        });

        setCourtsData(courtsList);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sân:", error);
      }
    };

    fetchCourts();
  }, []);

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="bg-blue-50 min-h-screen p-6 flex flex-col items-center justify-center">
      <div>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-300 to-green-300 text-center border-gray-200 p-8 mb-6 text-gray-800 rounded-lg flex flex-col justify-center items-center shadow-xl">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            THẾ GIỚI CẦU LÔNG
          </h1>
          <p className="text-xl text-blue-500 mb-2">0339191812</p>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Trung tâm giải trí Cầu Lông Tuy Phước. Xã Tuy Phước Đông, Tỉnh Gia Lai
          </p>
        </div>

        {/* Courts List */}
        <div className="grid grid-cols-1 gap-4 p-2 md:p-[10px] rounded-[10px] px-[40px]">
          {courtsData.map((court) => (
            <div
              key={court.id}
              className="flex flex-col md:flex-row gap-4 md:gap-10 bg-white p-3 md:p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                setIsModalOpen(true);
                setSelectId(court.id);
              }}
            >
              <Image
                src={court.image}
                alt={court.name}
                width={200}
                height={300}
                className="rounded-lg w-full md:w-[200px] h-auto object-cover"
              />
              <div className="text-gray-700">
                <h2 className="text-lg md:text-xl font-bold">{court.name}</h2>
                <p className="text-xs md:text-sm">
                  <strong>Loại Sân:</strong> {court.type}
                </p>
                <p className="text-xs md:text-sm">
                  <strong>Giá Sân:</strong>{" "}
                  {court.price.toLocaleString("vi-VN")} VND
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Cầu lông là thứ tồn tại duy nhất, những thứ còn lại có hay
                  không không quan trọng...
                </p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4"></h1>
          <ChatBot />
        </div>

        {/* Booking Modal */}
        <Modal
          footer={null}
          open={isModalOpen}
          onCancel={handleModalClose}
          width="95vw"
          centered
          style={{ maxWidth: 600 }}
        >
          <div className="flex flex-col justify-center items-center gap-1 mb-4 p-4 md:p-8 text-base md:text-xl">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-yellow-400 bg-clip-text text-transparent drop-shadow">
              THẾ GIỚI CẦU LÔNG
            </h1>
            <p className="text-base md:text-lg font-semibold text-pink-600 drop-shadow">
             0339191812
            </p>
            <p className="text-xs md:text-base text-center text-green-700 font-medium">
              Trung tâm giải trí Cầu Lông Tuy Phước.{" "}
              <span className="text-blue-700">Xã Tuy Phước Đông</span>,{" "}
              <span className="text-orange-600">Tỉnh Gia Lai</span>
            </p>
          </div>
          <BookingModal court={selectId} />
        </Modal>
      </div>
    </div>
  );
}
