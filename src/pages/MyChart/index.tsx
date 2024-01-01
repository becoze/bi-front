import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/bi_front/chartController";
import {message} from "antd";


/**
 * User generated Chart
 * @constructor
 */
const MyChartPage: React.FC = () => {

  // Load Chart from database using user parameters
  const initSearchParams = {
    pageSize: 12,
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})

  // Keep Chart to display a list
  const [chartList, setChartList] = useState<API.Chart[]>();

  // Keep total Chart number
  const [totalChart, setTotalChart] = useState<number>(0);

  const loadChart = async () => {
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
  }


  // Refresh data. Run loadChart() when first launched the page, and reload loadChart() when any change on searchParams
  useEffect(()=>{
    loadChart();
  }, [searchParams]);

  return (
    <div className="My-Chart">
      My Chart:
      { JSON.stringify(chartList)}
      <br/>
      Total:
      {totalChart}

    </div>
  );
};
export default MyChartPage;
