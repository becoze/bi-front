import { Footer } from '@/components';
import { listChartByPageUsingPOST } from "@/services/bi_front/chartController";
import { userRegisterUsingPOST } from "@/services/bi_front/userController";
import {
LockOutlined,
UserOutlined,
} from '@ant-design/icons';
import {
LoginForm,
ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet,history } from '@umijs/max';
import { Tabs,message } from 'antd';
import React,{ useEffect,useState } from 'react';
import { Link } from "umi";
import Settings from '../../../../config/defaultSettings';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  useEffect(()=>{
    listChartByPageUsingPOST({}).then(res => {
      console.error('res', res)
    })
  })



  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, confirmPassword} = values;
    // Password check
    if(userPassword !== confirmPassword){ // fields.userPassword !== fields.confirmPassword
      message.error('Password and Confirm Password not match!');
      return;
    }
    try {
      // Register
      const id = await userRegisterUsingPOST({ ...values });
      if (id) {
        const defaultRegisterSuccessMessage = 'Register successful!';
        message.success(defaultRegisterSuccessMessage);
        history.push('/user/login');
        return;
      }
    } catch (error) {
      const defaultRegisterFailureMessage = 'Register failed, please try again!';
      console.log(error);
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'Register'} - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: 'Register'
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Beco_Intelligent BI"
          subTitle={
            "Beco_Intelligent BI Liyuan liang Becoze"
            // <Link key="subTitle" to="https://www.linkedin.com/in/liyuan-liang/" target="_blank">
            //   <span></span>
            // </Link>
            // <a href="https://www.linkedin.com/in/liyuan-liang/" target="_blank"> Beco_Intelligent BI Liyuan liang Becoze </a>
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: 'Register Account',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'New Username'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your new username!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'New User Password'}
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: 'Password length should larger than 8',
                  }
                ]}
              />

              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'Confirm Password'}
                rules={[
                  {
                    required: true,
                    message: 'Please reenter your password!',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: 'Password length should larger than 8',
                  }
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to="/user/login">
              Go to Login
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
