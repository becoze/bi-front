import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'Produced by Becoze';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Beco_Intelligent BI',
          title: <a><LinkedinOutlined /> LinkedIn</a>,
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <a> <GithubOutlined /> Beco_Intelligent BI</a>,
          href: '',
          blankTarget: true,
        },
        {
          key: 'Beco_Intelligent BI',
          title: 'Beco_Intelligent BI',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
