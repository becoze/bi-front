import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/bi_front/chartController";
import {Avatar, Card, List, message} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";


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
            // 转换data.genChart成JSON格式
            const chartOption = JSON.parse(data.genChart ?? '{}');
            // 抹掉title
            chartOption.title = undefined;
            // 保存加工过的对象
            data.genChart = JSON.stringify(chartOption);
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
              {'Goal: ' + item.goal}

              <div style={{marginBottom: 16}}></div>
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
