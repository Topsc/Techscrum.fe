import React from 'react';
import FAQDetails from './components/FAQDetails/FAQDetails';
import FAQHeader from './components/FAQHeader/FAQHeader';
import FAQIcons from './components/FAQIcons/FAQIcons';

export default function FAQPage() {
  const getStarted = [
    'Inviting People to Your Teamwork Site',
    'Creating a Task List',
    'Tasks',
    'Adding Tasks in List View',
    'Companies - Owner and External',
    'Adding a Message',
    'Adding a Project',
    'Uploading Files in the Files Area',
    'Adding People to a Project',
    'Task Lists'
  ];
  const usingTeamwork = [
    'Inviting People to Your Teamwork Site',
    'Adding a Project',
    'Projects List View',
    'Creating a Task List',
    'Teamwork User License Types',
    'Adding Tasks in List View',
    'Understanding User Permissions and Access',
    "Updating Your Own and Other Users' Profile Preferences",
    'Companies - Owner and External',
    'Creating a Notebook'
  ];

  return (
    <>
      <FAQHeader />
      <FAQIcons />
      <FAQDetails links={getStarted} title="Getting Started" />
      <FAQDetails links={usingTeamwork} title="Using Teamwork" />
      <FAQDetails links={getStarted} title="Working with Your Projects" />
      <FAQDetails links={getStarted} title="Integrations" />
      <FAQDetails links={getStarted} title="Teamwork Tips" />
      <FAQDetails links={getStarted} title="Teamwork Settings" />
      <FAQDetails links={getStarted} title="Planning and Managing Work" />
      <FAQDetails links={getStarted} title="Pricing and Billing" />
      <FAQDetails links={getStarted} title="Agency and Professional Services" />
    </>
  );
}
