import { Table, Button } from "antd";
import { FormDataType } from "@/app/data/types";
import type { ColumnsType } from "antd/es/table";

interface TableScrollProps {
  columns: ColumnsType<FormDataType>;
  dataSource: FormDataType[];
  resetSearch: () => void;
  searchCourt: string;
  searchPaymentStatus: string;
}

const TableScroll = ({
  columns,
  dataSource,
  resetSearch,
  searchCourt,
  searchPaymentStatus,
}: TableScrollProps) => (
  <div className="w-full border rounded-lg shadow-sm bg-white overflow-hidden">
    <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <h3 className="text-sm sm:text-base font-semibold text-gray-700">
        {searchCourt
          ? `Danh sách đặt ${searchCourt}`
          : "Tất cả các đặt sân"}
        {searchPaymentStatus === "paid"
          ? " (Đã thanh toán)"
          : searchPaymentStatus === "unpaid"
          ? " (Chưa thanh toán)"
          : ""}
      </h3>
      <div className="text-xs sm:text-sm text-gray-500">
        Tổng số: {dataSource.length} đặt sân
      </div>
    </div>
    <div className="overflow-x-auto w-full scroll-container">
      <Table 
        scroll={{ x: "max-content" }} // hoặc scroll={{ x: 1000 }}
        columns={columns}
        dataSource={dataSource}
        className="w-full min-w-full"
        sticky={true}
        summary={(pageData) => {
          let totalAmount = 0;
          let paidAmount = 0;
          let unpaidAmount = 0;

          pageData.forEach((record: FormDataType) => {
            totalAmount += record.totalPrice || 0;
            if (record.isPaid) {
              paidAmount += record.totalPrice || 0;
            } else {
              unpaidAmount += record.totalPrice || 0;
            }
          });

          return (
            <>
  {/* Tổng tiền */}
  <Table.Summary.Row className="bg--100">
    <Table.Summary.Cell
      index={0}
      colSpan={8}
      className="text-right text-sm font-semibold text-gray-800 pr-4"
    >
      💰 Tổng tiền (trang hiện tại):
    </Table.Summary.Cell>
    <Table.Summary.Cell
      index={1}
      colSpan={2}
      className="text-left text-sm font-semibold text-blue-600 pl-2"
    >
      {totalAmount.toLocaleString()} VND
    </Table.Summary.Cell>
  </Table.Summary.Row>

  {/* Đã thanh toán */}
  <Table.Summary.Row className="bg--100">
    <Table.Summary.Cell
      index={0}
      colSpan={8}
      className="text-right text-sm font-semibold text-gray-800 pr-4"
    >
      ✅ <span className="text-green-600">Đã thanh toán:</span>
    </Table.Summary.Cell>
    <Table.Summary.Cell
      index={1}
      colSpan={2}
      className="text-left text-sm font-semibold text-green-600 pl-2"
    >
      {paidAmount.toLocaleString()} VND
    </Table.Summary.Cell>
  </Table.Summary.Row>

  {/* Chưa thanh toán */}
  <Table.Summary.Row className="bg-gray-100 border-t border-gray-300">
    <Table.Summary.Cell
      index={0}
      colSpan={8}
      className="text-right text-sm font-semibold text-gray-800 pr-4"
    >
      ❌ <span className="text-orange-500">Chưa thanh toán:</span>
    </Table.Summary.Cell>
    <Table.Summary.Cell
      index={1}
      colSpan={4}
      className="text-left text-sm font-semibold text-orange-500 pl-2"
    >
      {unpaidAmount.toLocaleString()} VND
    </Table.Summary.Cell>
  </Table.Summary.Row>
</>

          );
        }}
        locale={{
          emptyText: (
            <div className="py-6 sm:py-8 text-center">
              <div className="text-gray-500">Không có dữ liệu</div>
              {(searchCourt || searchPaymentStatus) && (
                <div className="mt-2">
                  <Button
                    type="primary"
                    onClick={resetSearch}
                    className="bg-blue-500"
                  >
                    Xem tất cả đặt sân
                  </Button>
                </div>
              )}
            </div>
          ),
        }}
      />
    </div>
  </div>
);

export default TableScroll;