import React from 'react';
import Tables from "../component/Tables";
import {Spin} from "antd";
import { Layout, Menu } from 'antd';
import logoRMD from '../img/red_mad_robot_logo.png'
import {CustomerServiceOutlined, UserOutlined} from "@ant-design/icons";

const TableLayout = () => {
    const { Header, Content, Footer } = Layout;
    return (
        <div>
            <Layout className="layout">
                <Header style={{background: "black"}}>
                    <img className="logo" src={logoRMD} alt="RMDLogo"/>
                    <Spin spinning size="small" style={{marginTop: '5px'}}/>
                </Header>
                <Content>
                    <Menu style={{margin: "20px", justifyContent: 'center', background: "black",}}
                          theme="dark"
                          mode="horizontal"
                          defaultSelectedKeys={['5']}
                          items={new Array(12).fill(null).map((_, index) => {
                              const key = index + 1;
                              return {
                                  key,
                                  label: `Month ${key}`,
                              };
                          })}
                    />
                    <Tables/>
                </Content>
                <Footer style={{textAlign: 'center',}}>
                    <UserOutlined className={'icon'} style={{ fontSize: '25px',margin: '10px'}} />
                    <CustomerServiceOutlined className={'icon'} style={{ fontSize: '25px',margin: '5px'}} />
                </Footer>
            </Layout>
        </div>
    );
};

export default TableLayout;