import {Button, Card, Col, Divider, Form, message, Row, Space, Spin, Upload} from 'antd';
import React, {useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import { genChartByYuAiUsingPOST } from "@/services/bi_front/chartController";
import ReactECharts from 'echarts-for-react';
import {ProFormSelect} from "@ant-design/pro-components";


/**
 * Generate AI Chart
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.YuAiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [eChartOption, setEChartOption] = useState<any>();

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

    // reset and clear Chart & eCharts-option, prevent stacking
    setChart(undefined);
    setEChartOption(undefined);

    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByYuAiUsingPOST(params, {}, values.file.file.originFileObj)

      if(!res?.data){
        message.error('AI analysis fail.')
      }else{
        message.success('AI analysis success');

        // Verify JSON parsing res.data.genChart is valid
        const eChartOption = JSON.parse(res.data.genChart ?? '');
        if(!eChartOption) {
          throw new Error("Chart parsing error.")
        } else {
          setChart(res.data);
          setEChartOption(eChartOption);
        }
      }
    } catch (e: any) {
      message.error('AI analysis fail, ' + e.message)
    }
    // turn submitting off, when submitting end
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Input">
            <Form
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
        </Col>

        <Col span={12}>
          <Card title="Chart">
            { eChartOption ? <ReactECharts option={eChartOption} /> : <div>Please submit information at the left panel </div>}
            <Spin spinning={submitting} />
          </Card>

          <Divider />

          <Card title="Concultion">
            {chart?.genResult ?? <div>Please submit information at the left panel </div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
