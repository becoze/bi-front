import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/bi_front/chartController";
import {Avatar, Button, Card, List, message, Popconfirm, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";
import {QuestionCircleOutlined} from "@ant-design/icons";


/**
 * User generated Chart
 * @constructor
 */
const MyChartPage: React.FC = () => {

  // Load Chart from database using user parameters
    const initSearchParams = {
      // Initialize the "current" page, which is the default page
      current: 1,
      // Item on each page
      pageSize: 6,
      sortField: 'createTime',
      sortOrder: 'desc',
    }

  // Parameters from backend: chartType, current, goal, id, name, pageSize, stc.
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})

  // List of a chart from database
  const [chartList, setChartList] = useState<API.Chart[]>();

  // Total Chart number
  const [totalChart, setTotalChart] = useState<number>(0);

  // A status check if loading charts
  const [loading, setLoading] = useState<boolean>(true);

  // User login state
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  const loadChart = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if(res.data){
        setChartList(res.data.records ?? []);
        setTotalChart(res.data.total ?? 0);
        // 抹去eChart的"title"
        if(res.data.records){
          // `forEach`: 遍历每一条数据，每一行内容
          res.data.records.forEach(data => {
            if(data.status === 'succeed'){
              // 转换data.genChart成JSON格式
              const chartOption = JSON.parse(data.genChart ?? '{}');
              // 抹掉title
              chartOption.title = undefined;
              // 保存加工过的对象
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('Chart loading failed');
      }
    } catch (e: any) {
      message.error('Chart loading failed' + e.message);
    }

    setLoading(false);
  }

  const showTime = (inputTimeString: any) => {
    // Parse the input string into a Date object
    const date = new Date(inputTimeString);

    // Format the date and time
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString();

    // Concatenate the time and date in the desired format
    const formattedTimeString = `${time} ${formattedDate}`;

    return formattedTimeString;
  }



  // Refresh data. Run loadChart() when first launched the page, and reload loadChart() when any change on searchParams
  useEffect(()=>{
    loadChart();
  }, [searchParams]);

  return (
    <div className="My-Chart">
      <div className={'margin-16'}>
        <Search placeholder="Search Chart Name" enterButton loading={loading} onSearch={(value) => {
          setSearchParams({
            // init the parameters to go back to first page for each search
            ...initSearchParams,
            name: value,
          })
        } }/>
      </div>
      <div style={{marginBottom: 16}}></div>
      <List
        grid={{ gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          total: totalChart,
          pageSize: searchParams.pageSize,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={ item.name }
                description={ item.chartType ? ('Given Chart Type: ' + item.chartType) : 'Not given - AI deiced' }
              />
              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="Waiting for processing..."
                      subTitle={item.execMessage ?? 'System buys, please wait.'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="Generating concultions"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div style={{ marginBottom: 16 }} />
                    <p> {'Goal: ' + item.goal} </p>
                    <div style={{ marginBottom: -30 }}/>
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                    <div style={{ marginBottom: -16 }} />
                    <p> {item.genResult} </p>
                    <p> {'Create Time: ' + showTime(item.createTime)} </p>
                  </>
                }
                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="Generation failed!"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
              <Popconfirm
                title="Delete"
                description="Confirm Delete?"
                onConfirm={() => {
                  // deleteChartUsingPOST();
                  message.success('Deleted successfully!')
                  loadChart();
                }}
                icon={<QuestionCircleOutlined style={{color: 'pink'}}/>}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
