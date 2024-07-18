import React from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Progress, Divider } from 'antd';
import { Bar } from '@ant-design/charts';

const { Header, Content } = Layout;

const AdminDashboard = () => {
  const barData = [
    { department: 'Dept 1', value: 38 },
    { department: 'Dept 2', value: 52 },
    { department: 'Dept 3', value: 61 },
    { department: 'Dept 4', value: 45 },
    { department: 'Dept 5', value: 48 },
  ];

  const barConfig = {
    data: barData,
    xField: 'value',
    yField: 'department',
    seriesField: 'department',
    legend: { position: 'top-left' },
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <h1>Admin Stats</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Students" value={13331} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Job Profiles" value={13331} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Offers" value={13331} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Placed" value={13331} />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Bar {...barConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h3>Recent Placement Drives</h3>
              <p>- How many offers?</p>
              <p>- How many selected?</p>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <h3>Students Placed Status</h3>
              <Progress type="circle" percent={75} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h3>Companies</h3>
              <Progress type="circle" percent={50} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
