import { useModel } from '@umijs/max';
import {Button, ColorPicker, Form, Select, Space, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {listChartByPageUsingPOST} from "@/services/bi_front/chartController";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');


  useEffect(()=>{
    listChartByPageUsingPOST({}).then(res => {
      console.error('res', res)
      // todo push data to backend
    })
  })


  const onFinish = (values: any) => {
    console.log('User Input ', values);
  };

  return (
    <div className="add-chart">
      <Form
        name="add-chart"
        onFinish={onFinish}
        initialValues={{  }}
      >

        <Form.Item name="goal" label="Goal" rules={[{ required: true, message: 'Please enter your analysis goal!' }]}>
          <TextArea placeholder = "Analysis Goal, For example: Give me the user grow analysis"/>
        </Form.Item>

        <Form.Item name="name" label="Chart name" rules={[{ required: true, message: 'Please give a me to the chart!' }]}>
          <TextArea placeholder = "Name of the chart, For example: User grow "/>
        </Form.Item>

        <Form.Item
          name="chartType"
          label="Chart Type"
        >
          < Select
            placeholder="Please select a chart type"
            options={[
              {value: '(Let ai deice)', label: ''},
              {value: 'Bar chart', label: 'Bar chart'},
              {value: 'Line chart', label: 'Line chart'},
              {value: 'Pie chart', label: 'Pie chart'},
              {value: 'xxx', label: 'xxx'},
              {value: 'yyy', label: 'yyy'},
          ]}/>
        </Form.Item>


        <Form.Item
          name="file"
          label="Row Data"
        >
          <Upload name="file" >
            <Button icon={<UploadOutlined />}>Upload CSV file</Button>
          </Upload>
        </Form.Item>


        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="reset">reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
