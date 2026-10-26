
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentSidebar } from '../../../../shared/components/agent/agent-sidebar/agent-sidebar';
import { DashboardTopbar } from '../../../../shared/components/dashboard-topbar/dashboard-topbar';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [RouterOutlet, AgentSidebar, DashboardTopbar],
  templateUrl: './agent-layout.html'
})
export class AgentLayout {}
