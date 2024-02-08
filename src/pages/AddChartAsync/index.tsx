import {Button, Card, Form, message, Space, Upload} from 'antd';
import React, {useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {genChartByYuAiAsyncUsingPOST} from "@/services/bi_front/chartController";
import {ProFormSelect} from "@ant-design/pro-components";
import {useForm} from "antd/es/form/Form";


/**
 * Generate AI Chart (Async)
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * submit
   * @param values
   */
  const onFinish = async (values: any) => {
    // prevent multiple submit
    if(submitting){
      return;
    }
    // turn submitting on
    setSubmitting(true);


    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByYuAiAsyncUsingPOST(params, {}, values.file.file.originFileObj)

      if(!res?.data){
        message.error('Submit fail, Please try again later')
      }else{
        message.success('Submit successful! You can find your result in "My Charts" page.');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('AI analysis fail, ' + e.message)
    }
    // turn submitting off, when submitting end
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title={"Analysis"}>
        <Form
          form={form}
          name="add-chart"
          onFinish={onFinish}
          labelAlign="left"
          labelCol={{span:4}}
          // wrapperCol={{span:16}}
          // initialValues={{  }}
        >

          <Form.Item name="goal" label="Goal" rules={[{ required: true, message: 'Please enter your analysis goal!' }]}>
            <TextArea placeholder = "Analysis Goal, For example: Give me the user grow analysis"/>
          </Form.Item>

          <Form.Item name="name" label="Chart name" rules={[{ required: true, message: 'Please give a name to the chart!' }]}>
            <TextArea placeholder = "Name of the chart, For example: User grow "/>
          </Form.Item>

          <ProFormSelect
            name="chartType"
            label="Chart Type"
            showSearch
            debounceTime={300}
            request={async () => {
              // await waitTime(100);
              return [
                { value: '(Let ai deice)', label: '' },
                { value: 'Bar Chart', label: 'Bar Chart' },
                { value: 'Line Chart', label: 'Line Chart' },
                { value: 'Pie Chart', label: 'Pie chart' },
                { value: 'Scatter Plot', label: 'Scatter Plot' },
                { value: 'Histogram', label: 'Histogram' },
                { value: 'Radar Chart', label: 'Radar Chart' },
                { value: 'Treemap', label: 'Treemap' },
              ];
            }}
            placeholder="Please select a country"
            rules={[{ required: true, message: 'Please select your country!' }]}
          />


          <Form.Item
            name="file"
            label="Row Data"
          >
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload CSV file</Button>
            </Upload>
          </Form.Item>


          <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
