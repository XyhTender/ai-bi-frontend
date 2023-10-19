import {GithubOutlined, InfoCircleOutlined, WechatOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import {Tooltip} from "antd";
import wechat from '@/../public/assets/weixin.png';

const Footer: React.FC = () => {
  const defaultMessage = '小霖出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={<>
        {`${currentYear} ${defaultMessage}`} |{' '}
        <a target={'_blank'} href={"https://beian.miit.gov.cn/"} rel="noreferrer"> 蜀ICP备2023012971号</a>
      </>}
      links={[
        {
          key: 'github',
          title: (
            <Tooltip title="查看本站技术及源码，欢迎 star">
              <GithubOutlined/> 支持项目
            </Tooltip>
          ),
          href: 'https://gitee.com/xlzcandy',
          blankTarget: true,
        },
        {
          key: 'contact',
          title: (
            <Tooltip title={<img src={wechat} alt="微信 code_nav" width="120"/>}>
              <WechatOutlined/> 联系作者
            </Tooltip>
          ),
          href: 'https://qm.qq.com/q/yAsEIpcfIG&personal_qrcode_source=4',
          blankTarget: true,
        },
        {
          key: 'info',
          title: (
            <>
              <InfoCircleOutlined/> 免责声明
            </>
          ),
          href: 'https://gitee.com/xlzcandy/website-statement/blob/master/%E6%99%BA%E8%83%BDBI%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%B9%B3%E5%8F%B0%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md',
          blankTarget: true,
        }
      ]}
    />
  );
};
export default Footer;
