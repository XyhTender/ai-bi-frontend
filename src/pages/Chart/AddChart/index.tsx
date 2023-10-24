import { genChartByAiUsingPOST } from '@/services/ai-bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [char, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    //判断是否在提交 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true); //开始提交时候设置成加载状态
    setChart(undefined);
    setOption(undefined);
    //对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const result = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(result);
      if (!result?.data) {
        message.error('分析失败！');
      } else {
        message.success('分析成功！');
        //判断生成的Echarts代码能不能解析
        const charOption = JSON.parse(result.data.genChart ?? '');
        if (!charOption) {
          throw new Error('AI抽风，图表代码解析错误！');
        } else {
          setChart(result.data);
          setOption(charOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false); //加载完成后返回原样
  };
  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析" hoverable={true} type="inner">
            <Form
              name="addChart"
              labelAlign={'left'}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 17 }}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标！' }]}
              >
                <TextArea placeholder="请输入你的分析需求：分析网站用户的增长情况" />
              </Form.Item>

              <Form.Item
                name="name"
                label="图表名称"
                rules={[{ required: true, message: '请输入图表名称！' }]}
              >
                <Input placeholder="请输入你的图表名称" />
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
                hasFeedback
                rules={[{ required: true, message: '请选择图表类型!' }]}
              >
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '饼图', label: '饼图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '漏斗图', label: '漏斗图' },
                    { value: '散点图', label: '散点图' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
                rules={[{ required: true, message: '请上传Excel文件！' }]}
              >
                <Upload name="file" action="/upload.do" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传Excel文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论" hoverable={true} type="inner">
            {char?.genResult ?? <div>请先在左侧智能分析Card进行数据提交</div>}
          </Card>
          <Divider />
          <Card title="生成图表" hoverable={true} type="inner">
            {option ? (
              <ReactECharts option={option} />
            ) : (
              <div>请先在左侧智能分析Card进行数据提交</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
