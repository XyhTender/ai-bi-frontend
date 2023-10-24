import { listMyChartByPageUsingPOST } from '@/services/ai-bi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, List, message } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  // 获取登录的用户信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  // 获取需要的数据
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });

  //存图表数据
  const [chartList, setChartList] = useState<API.Chart[]>();

  //获取总页数
  const [total, setTotal] = useState<number>();

  const [loading, setLoading] = useState<boolean>();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);

        //去除Echarts代码中的title  隐藏图表标题
        if (res.data.records) {
          res.data.records.forEach((data) => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          });
        }
      } else {
        message.error('获取图表失败！');
      }
    } catch (e: any) {
      message.error('获取我的图表失败！' + e.message);
    }
    setLoading(false);
  };

  //首次页面加载时触发一下加载数据  --> searchParams改变时，触发时候自动加载数据
  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart">
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          onSearch={(value) => {
            //初始化页面 设置搜索框
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }} />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card hoverable={true}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser?.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <div style={{ marginBottom: 16 }} />
              {'分析目标：' + item.goal}
              <div style={{ marginBottom: 16 }} />
              {/*item.genChart为空则展示一个空对象*/}
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChart;
