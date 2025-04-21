import React from 'react';
import DashboardCard from './DashboardCard';
import StatsChart from './StatsChart';
import AnimatedDashboardStats from './AnimatedDashboardStats';

const DashboardDemo = () => {
  // Sample data for charts
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Maintenance Requests',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(10, 179, 172)', // propagentic-teal
        backgroundColor: 'rgba(10, 179, 172, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const barChartData = {
    labels: ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'],
    datasets: [
      {
        label: 'Open Requests',
        data: [5, 3, 2, 4, 1, 2],
        backgroundColor: 'rgba(23, 140, 249, 0.6)', // propagentic-blue
        borderColor: 'rgb(23, 140, 249)',
        borderWidth: 1
      }
    ]
  };
  
  // Sample data for smaller trend charts in stats cards
  const trendData1 = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [{
      data: [3, 7, 5, 9, 6, 8, 10],
      borderColor: 'rgb(10, 179, 172)',
      backgroundColor: 'rgba(10, 179, 172, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };
  
  const trendData2 = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [{
      data: [8, 9, 12, 10, 7, 5, 4],
      borderColor: 'rgb(23, 140, 249)',
      backgroundColor: 'rgba(23, 140, 249, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };
  
  const trendData3 = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [{
      data: [5, 4, 6, 7, 9, 7, 8],
      borderColor: 'rgb(4, 184, 81)',
      backgroundColor: 'rgba(4, 184, 81, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };
  
  const trendData4 = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [{
      data: [2, 1, 3, 5, 4, 7, 9],
      borderColor: 'rgb(255, 184, 0)',
      backgroundColor: 'rgba(255, 184, 0, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2
    }]
  };
  
  return (
    <div className="space-y-8">
      {/* Stats Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold text-propagentic-slate-dark dark:text-white mb-6">
          Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedDashboardStats 
            title="Total Maintenance Requests"
            value={87}
            previousValue={75}
            percentageChange={16}
            description="vs. last month"
            chartData={trendData1}
            theme="primary"
            delay={0}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          
          <AnimatedDashboardStats 
            title="Active Tenants"
            value={42}
            previousValue={36}
            percentageChange={16.7}
            description="vs. last month"
            chartData={trendData2}
            theme="secondary"
            delay={0.1}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          
          <AnimatedDashboardStats 
            title="Resolved Requests"
            value={64}
            previousValue={52}
            percentageChange={23.1}
            description="vs. last month"
            chartData={trendData3}
            theme="success"
            delay={0.2}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <AnimatedDashboardStats 
            title="Average Response Time"
            value={8}
            previousValue={12}
            percentageChange={-33.3}
            description="vs. last month"
            chartData={trendData4}
            theme="warning"
            delay={0.3}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </section>
      
      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Maintenance Requests Trend"
          theme="primary"
          animate
          delay={0.4}
        >
          <div className="h-80">
            <StatsChart 
              type="line"
              data={lineChartData}
              height={300}
              animate
            />
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Requests by Category"
          theme="secondary"
          animate
          delay={0.5}
        >
          <div className="h-80">
            <StatsChart 
              type="bar"
              data={barChartData}
              height={300}
              animate
            />
          </div>
        </DashboardCard>
      </section>
      
      {/* Recent Requests Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-propagentic-slate-dark dark:text-white">
            Recent Requests
          </h2>
          <button className="text-propagentic-teal hover:text-propagentic-teal-dark font-medium flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="bg-white dark:bg-propagentic-slate-dark rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-propagentic-slate">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-propagentic-slate-dark divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 'MR-1024', issue: 'Leaking kitchen faucet', property: 'Sunset Apartments #304', tenant: 'John Smith', status: 'In Progress', date: '2023-06-10' },
                { id: 'MR-1023', issue: 'Heating not working', property: 'Oakwood Terrace #201', tenant: 'Maria Garcia', status: 'New', date: '2023-06-09' },
                { id: 'MR-1022', issue: 'Broken dishwasher', property: 'Lakeside Manor #502', tenant: 'Robert Johnson', status: 'Completed', date: '2023-06-08' },
                { id: 'MR-1021', issue: 'Electrical outlet not working', property: 'Maple Heights #105', tenant: 'Sarah Williams', status: 'In Progress', date: '2023-06-07' },
                { id: 'MR-1020', issue: 'Bathroom ceiling leak', property: 'Sunset Apartments #201', tenant: 'James Wilson', status: 'Urgent', date: '2023-06-06' },
              ].map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-propagentic-slate cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-propagentic-teal">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{request.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{request.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{request.tenant}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                        request.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{request.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardDemo; 