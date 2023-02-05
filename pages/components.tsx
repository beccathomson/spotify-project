import React from 'react';
import Page from './../layouts/main';
import Badge from './../components/badge';
import Panel from './../components/panel';

const Components = (props: { children: React.ReactNode }) => <Page>
  <h2>Panel</h2>
  <Panel>This is a panel</Panel>
  <h2>Badge</h2>
  <Badge>This is a badge</Badge>
  <h2>DuplicateTrackList</h2>
</Page>;

export default Components;
