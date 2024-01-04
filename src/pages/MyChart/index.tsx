import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/bi_front/chartController";
import {Avatar, Card, List, message} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";


/**
 * User generated Chart
 * @constructor
 */
const MyChartPage: React.FC = () => {

  // Load Chart from database using user parameters
  const initSearchParams = {
    pageSize: 12,
  }

  //
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
          onChange: (page) => {
            console.log(page);
          },
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
