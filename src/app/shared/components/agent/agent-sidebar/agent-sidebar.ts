
import { Component } from '@angular/core';
import { DashboardSidebar } from '../../dashboard-sidebar/dashboard-sidebar';
import { AGENT_MENU } from '../../dashboard-menu.config';

@Component({
  selector: 'app-agent-sidebar',
  standalone: true,
  imports: [DashboardSidebar],
  templateUrl: './agent-sidebar.html'
})
export class AgentSidebar {
  readonly menu = AGENT_MENU;
}
