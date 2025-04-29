import React, { useState } from 'react';
import { SafeMotion } from '../../shared/SafeMotion';
import { UIComponentErrorBoundary } from '../../shared/ErrorBoundary';
import Button from '../../ui/Button';
import DashboardPreview from '../newComponents/DashboardPreview';
import { 
  BuildingIcon, 
  WrenchIcon, 
  ClipboardCheckIcon,
  UserIcon,
  ChartIcon,
  DocumentIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  RentPaymentIcon,
  BriefcaseIcon
} from '../../icons/DashboardIcons';

/**
 * A section showcasing role-specific problem-solution pairs with an interactive toggle
 */
const RoleProblemSolutionSection = () => {
  const [activeRole, setActiveRole] = useState('landlord');

  return (
    <UIComponentErrorBoundary componentName="RoleProblemSolutionSection">
      <section className="py-20 bg-gradient-to-b from-white to-teal-50 dark:from-neutral-900 dark:to-teal-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Real Solutions for Real Challenges
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              See how our platform transforms property management for everyone involved
            </p>
          </div>
          
          {/* Role toggle bar */}
          <div className="flex justify-center mb-12">
            <div 
              className="inline-flex flex-wrap justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1 shadow-sm border border-border dark:border-border-dark"
              role="tablist"
              aria-label="User role selector"
            >
              <Button
                variant={activeRole === 'landlord' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveRole('landlord')}
                size="sm"
                role="tab"
                aria-selected={activeRole === 'landlord'}
                className="!rounded-full"
              >
                Landlord
              </Button>
              <Button
                variant={activeRole === 'tenant' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveRole('tenant')}
                size="sm"
                role="tab"
                aria-selected={activeRole === 'tenant'}
                className="!rounded-full"
              >
                Tenant
              </Button>
              <Button
                variant={activeRole === 'contractor' ? 'tab-active' : 'tab-inactive'}
                onClick={() => setActiveRole('contractor')}
                size="sm"
                role="tab"
                aria-selected={activeRole === 'contractor'}
                className="!rounded-full"
              >
                Contractor
              </Button>
            </div>
          </div>
          
          {/* Problem/Solution Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {painPoints[activeRole].map((point, index) => (
              <SafeMotion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProblemSolutionCard 
                  problem={point.problem}
                  solution={point.solution}
                  icon={point.icon}
                  stats={point.stats}
                />
              </SafeMotion.div>
            ))}
          </div>
          
          {/* Interactive demo preview */}
          <div className="mt-20">
            <DashboardPreview activeTab={activeRole} />
          </div>
        </div>
      </section>
    </UIComponentErrorBoundary>
  );
};

// Problem Solution Card Component
const ProblemSolutionCard = ({ problem, solution, icon, stats }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-border dark:border-border-dark h-full flex flex-col">
      {/* Card header with icon */}
      <div className="p-6 border-b border-border dark:border-border-dark flex items-center">
        <div className="mr-4 bg-primary/10 dark:bg-primary/20 p-3 rounded-lg text-primary dark:text-primary-light">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{solution.title}</h3>
      </div>
      
      {/* Card content */}
      <div className="flex-grow p-6">
        <div className="mb-6">
          <h4 className="text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">The Challenge</h4>
          <p className="text-neutral-700 dark:text-neutral-300">{problem.description}</p>
        </div>
        
        <div>
          <h4 className="text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">Our Solution</h4>
          <p className="text-neutral-700 dark:text-neutral-300">{solution.description}</p>
        </div>
      </div>
      
      {/* Card footer with stats */}
      {stats && (
        <div className="border-t border-border dark:border-border-dark bg-neutral-50 dark:bg-neutral-900 p-4">
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.value}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{stats.label}</div>
            </div>
            {stats.secondaryValue && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{stats.secondaryValue}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{stats.secondaryLabel}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Role-specific pain points and solutions
const painPoints = {
  landlord: [
    {
      problem: {
        description: "Managing maintenance requests is time-consuming and often requires manual coordination between tenants and contractors."
      },
      solution: {
        title: "Streamlined Maintenance",
        description: "Our system automatically categorizes requests, finds qualified contractors, and keeps all parties updated in real-time."
      },
      icon: <WrenchIcon className="w-6 h-6" />,
      stats: {
        value: "68%",
        label: "Less time spent on maintenance coordination",
        secondaryValue: "24hrs",
        secondaryLabel: "Average resolution time"
      }
    },
    {
      problem: {
        description: "Tracking rent payments, property expenses, and overall financial performance is difficult and error-prone."
      },
      solution: {
        title: "Financial Visibility",
        description: "Get a comprehensive view of all your properties' financial performance with automated rent collection and expense tracking."
      },
      icon: <ChartIcon className="w-6 h-6" />,
      stats: {
        value: "52%",
        label: "Reduction in late rent payments",
        secondaryValue: "89%",
        secondaryLabel: "Landlords report better financial insights"
      }
    },
    {
      problem: {
        description: "Property inspections and documentation are inconsistent and difficult to manage across multiple properties."
      },
      solution: {
        title: "Simplified Documentation",
        description: "Digital inspection reports, automated record-keeping, and cloud storage for all property-related documents in one place."
      },
      icon: <DocumentIcon className="w-6 h-6" />,
      stats: {
        value: "5x",
        label: "Faster document retrieval",
        secondaryValue: "100%",
        secondaryLabel: "Digital record compliance"
      }
    }
  ],
  tenant: [
    {
      problem: {
        description: "Maintenance issues take too long to resolve and there's little visibility into the repair process."
      },
      solution: {
        title: "Fast Maintenance Requests",
        description: "Submit requests with photos in seconds, track progress in real-time, and rate the service when complete."
      },
      icon: <WrenchIcon className="w-6 h-6" />,
      stats: {
        value: "83%",
        label: "Tenants report higher satisfaction with repairs",
        secondaryValue: "2hr",
        secondaryLabel: "Average initial response time"
      }
    },
    {
      problem: {
        description: "Paying rent is inconvenient, requiring checks or multiple payment platforms with fees."
      },
      solution: {
        title: "Simple Rent Payments",
        description: "Pay rent online through multiple methods with automatic reminders and instant receipts."
      },
      icon: <RentPaymentIcon className="w-6 h-6" />,
      stats: {
        value: "0",
        label: "Payment processing fees for tenants",
        secondaryValue: "3 mins",
        secondaryLabel: "Average time to pay rent"
      }
    },
    {
      problem: {
        description: "Communication with landlords is inconsistent and important messages get lost in email or text."
      },
      solution: {
        title: "Centralized Communication",
        description: "All property-related communications in one place with message history and document sharing."
      },
      icon: <UserIcon className="w-6 h-6" />,
      stats: {
        value: "100%",
        label: "Message delivery rate",
        secondaryValue: "24/7",
        secondaryLabel: "Access to communication history"
      }
    }
  ],
  contractor: [
    {
      problem: {
        description: "Finding consistent work requires extensive networking and marketing, with unpredictable income."
      },
      solution: {
        title: "Steady Job Pipeline",
        description: "Receive job opportunities that match your skills and availability, with the ability to accept work at your convenience."
      },
      icon: <BriefcaseIcon className="w-6 h-6" />,
      stats: {
        value: "47%",
        label: "Average increase in monthly jobs",
        secondaryValue: "92%",
        secondaryLabel: "Job match satisfaction rate"
      }
    },
    {
      problem: {
        description: "Getting paid is often slow and requires multiple follow-ups with property managers."
      },
      solution: {
        title: "Fast, Reliable Payments",
        description: "Digital invoicing with preset rates and automatic payment processing once jobs are completed and approved."
      },
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      stats: {
        value: "2 days",
        label: "Average payment processing time",
        secondaryValue: "100%",
        secondaryLabel: "Payment reliability"
      }
    },
    {
      problem: {
        description: "Scheduling and coordinating with tenants and property managers is time-consuming and often leads to wasted trips."
      },
      solution: {
        title: "Efficient Scheduling",
        description: "Built-in calendar with tenant availability, automated appointment reminders, and real-time access coordination."
      },
      icon: <CalendarIcon className="w-6 h-6" />,
      stats: {
        value: "73%",
        label: "Reduction in scheduling conflicts",
        secondaryValue: "4.8/5",
        secondaryLabel: "Average contractor satisfaction"
      }
    }
  ]
};

export default RoleProblemSolutionSection; 