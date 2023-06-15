import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    loading = true;
    isButtonLoading = false;
    playerId = new FormControl<string>('', { nonNullable: true });

    activePlayers: { name: string; value: number }[] = [];
    attackPlayers: { name: string; value: number }[] = [];
    chestPlayers: { name: string; series: { name: string; value: number }[] }[] = [];

    playerChestCount = 0;
    playerAttackCount = 0;
    playerActiveCount = 0;
    isPlayerIdValid = false;

    constructor(private database: DatabaseService, private messageService: MessageService) {}

    ngOnInit(): void {
        setInterval(() => {
            this.database.getMostActivePlayers().subscribe({
                next: (response) => {
                    this.activePlayers = response.map((item) => ({ name: item._id, value: item.count }));
                    console.log(response);
                },
                error: (error: any) => {
                    console.log(error);
                },
            });

            this.database.getMostAttackPlayers().subscribe({
                next: (response) => {
                    this.attackPlayers = response.map((item) => ({ name: item._id, value: item.count }));
                    console.log(response);
                },
                error: (error: any) => {
                    console.log(error);
                },
            });

            this.database.getMostChestPlayers().subscribe({
                next: (response) => {
                    this.chestPlayers = response.map((item) => ({
                        name: item.playerId,
                        series: [{ name: 'Chests', value: item.chestCount }],
                    }));
                    console.log(response);
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    this.loading = false;
                },
            });
        }, 1000);
    }

    view: [number, number] = [700, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    showYAxisLabel = true;

    colorScheme: any = {
        domain: ['#9575cd', '#33ac71', '#4e79a7', '#ffbb78', '#8c6d31', '#a5c8e1'],
    };

    // pie
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    legendPosition: LegendPosition = LegendPosition.Below;

    schemeType: ScaleType = ScaleType.Linear;

    onSelect(data: any): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data: any): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data: any): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    onSearch(): void {
        const playerId = this.playerId.value;
        this.isButtonLoading = true;
        if (playerId !== '') {
            this.database.getCountOfGrabbedChestByPlayer(playerId).subscribe({
                next: (response) => {
                    this.playerChestCount = response;
                    this.isPlayerIdValid = true;
                    this.isButtonLoading = false;
                    console.log(response);
                },
                error: (error) => {
                    this.isPlayerIdValid = false;
                    this.isButtonLoading = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found' });
                },
            });
            this.database.getCountOfAttacksByPlayer(playerId).subscribe((response) => {
                this.playerAttackCount = response;
                console.log(response);
            });
            this.database.getCountOfActiveByPlayer(playerId).subscribe((response) => {
                this.playerActiveCount = response;
                console.log(response);
            });
        }
    }
}
