import { expect, Locator, Page } from '@playwright/test';

export type NewTask = {
    title: string;
    description: string;
    responsiblePerson: string;
    status: string;
    dueDate: string;
};

export class TasksPage {
    private readonly newTaskButton: Locator;

    private readonly taskForm: Locator;
    private readonly taskList: Locator;

    private readonly titleInput: Locator;
    private readonly descriptionInput: Locator;
    private readonly responsiblePersonInput: Locator;
    private readonly statusSelect: Locator;
    private readonly dueDateInput: Locator;
    private readonly submitButton: Locator;

    constructor(private page: Page) {
        this.newTaskButton = this.page.getByRole('button', { name: /New Task/ });

        this.taskForm = page.locator('#task-form');
        this.taskList = page.locator('#tasks-list');

        this.titleInput = this.taskForm.getByLabel('Title', { exact: true });
        this.descriptionInput = this.taskForm.getByLabel('Description', { exact: true });
        this.responsiblePersonInput = this.taskForm.getByLabel('Responsible person', { exact: true });
        this.statusSelect = this.taskForm.getByLabel('Status', { exact: true });
        this.dueDateInput = this.taskForm.getByLabel('Due date', { exact: true });
        this.submitButton = this.taskForm.getByRole('button', { name: 'Create task' });
    }

    async openCreateForm(): Promise<void> {
        await this.newTaskButton.click();
    }

    async openEditForm(taskTitle: string): Promise<void> {
        const taskCard = this.taskList.locator('.list-item').filter({hasText: taskTitle});
        await taskCard.getByRole('button', { name: 'Edit' }).click();
        await expect(this.taskList.locator('.edit-task-title')).toBeVisible();
    }

    async createNewTask({title, description, responsiblePerson, status, dueDate}: NewTask): Promise<void> {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.responsiblePersonInput.fill(responsiblePerson);
        await this.statusSelect.selectOption({ label: status });
        await this.dueDateInput.fill(dueDate);
        await this.submitButton.click();
    }

    async editTask(originalTitle: string, task: NewTask): Promise<void> {
        const taskCard = this.taskList.locator('.list-item').filter({ has: this.page.locator('.edit-task-title') });
        await taskCard.locator('.edit-task-title').fill(task.title);
        await taskCard.locator('.edit-task-description').fill(task.description);
        await taskCard.locator('.edit-task-responsible').fill(task.responsiblePerson);
        await taskCard.locator('.edit-task-status').selectOption({ label: task.status });
        await taskCard.locator('.edit-task-due-date').fill(task.dueDate);
        await taskCard.locator('.card-actions').getByRole("button", { name: 'Save changes' }).click();
    }



    async deleteTask(taskTitle: string) {
        const taskCard = this.taskList.locator('.list-item').filter({hasText: taskTitle});
        this.page.once('dialog', async dialog => {
            await dialog.accept();
            });
        await taskCard.getByRole('button', { name: 'Delete' }).click();

    }

}



