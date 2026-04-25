import {
  Button,
  Select,
  Input,
  Space,
  Form,
  FormInstance,
} from "antd";
import { CourtType } from "@/app/data/types";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFormValues {
  name?: string;
  phone?: string;
  courtId?: string;
  paymentStatus?: string;
}

interface SearchFormProps {
  form: FormInstance<SearchFormValues>;
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
  courtsData: CourtType[];
}

const SearchForm = ({ form, onSearch, onReset, courtsData }: SearchFormProps) => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow">
      <div className="p-3 sm:p-4">
        <Form
          form={form}
          layout="vertical"
          className="w-full"
          onFinish={onSearch}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div>
              <Form.Item name="name" label="Tìm theo tên" className="mb-2">
                <Input
                  placeholder="Nhập tên khách hàng"
                  allowClear
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="phone" label="Tìm theo số điện thoại" className="mb-2">
                <Input
                  placeholder="Nhập số điện thoại"
                  allowClear
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="courtId" label="Tìm theo sân" className="mb-2">
                <Select
                  placeholder="Chọn sân"
                  allowClear
                  options={[
                    ...courtsData.map((court) => ({
                      label: court.name,
                      value: court.id,
                    })),
                  ]}
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item name="paymentStatus" label="Trạng thái thanh toán" className="mb-2">
                <Select
                  placeholder="Trạng thái thanh toán"
                  allowClear
                  options={[
                    { label: "Đã thanh toán", value: "paid" },
                    { label: "Chưa thanh toán", value: "unpaid" },
                  ]}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Space className="flex-wrap gap-2">
              <Button
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
                className="bg-blue-500"
              >
                Tìm kiếm
              </Button>
              <Button onClick={onReset}>Đặt lại</Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SearchForm;