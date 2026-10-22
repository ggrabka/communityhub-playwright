import { test, expect } from "@playwright/test";
import { DashboardPage } from "../src/pages/dashboardPage";
import { LoginPage } from "../src/pages/loginPage";
import { randomUUID } from 'node:crypto';
import { NewTask, TasksPage } from "../src/pages/tasksPage";

test('navigate to tasks page from dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    await loginPage.login('admin', 'admin123');
    await expect(page.locator('#dashboard-view')).toBeVisible();

    await dashboardPage.navigateToTasks();
    await expect(page.locator('#tasks-section')).toBeVisible();
});

test('create a new task', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const tasksPage = new TasksPage(page);

    const taskTitle = `PW Task ${randomUUID()}`;
    let taskId: number | undefined = undefined;

    const task: NewTask = {
        title: taskTitle,
        description: 'Created by Playwright automation',
        responsiblePerson: 'Test User',
        status: 'New',
        dueDate: '2026-12-19'
    };

    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    await loginPage.login('admin', 'admin123');
    await expect(page.locator('#dashboard-view')).toBeVisible();

    await dashboardPage.navigateToTasks();
    await expect(page.locator('#tasks-section')).toBeVisible();

    await tasksPage.openCreateForm();



    try {
        const responsePromise = page.waitForResponse(
            response => response.url().endsWith('/api/tasks') &&
                response.request().method() === 'POST'
        )

        await tasksPage.createNewTask(task);

        const response = await responsePromise;
        expect(response.status()).toBe(201);
        const responseBody = await response.json();

        expect(responseBody.success).toBe(true);
        expect(typeof responseBody.task?.id).toBe('number');
        taskId = responseBody.task.id;

        await expect(page.locator('#tasks-list').getByText(taskTitle, { exact: true })).toBeVisible();
    } finally {

        if (taskId !== undefined) {
            const deleteResponse = await page.request.delete(`/api/tasks/${taskId}`);
            expect(deleteResponse.ok()).toBeTruthy();
        }


    }
});

test('edit a task', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const tasksPage = new TasksPage(page);

    const taskTitle = `PW Task ${randomUUID()}`;
    const editedTaskTitle = `PW edited Task ${randomUUID()}`;
    let taskId: number | undefined = undefined;

    const task: NewTask = {
        title: taskTitle,
        description: 'Created by Playwright automation',
        responsiblePerson: 'Test User',
        status: 'New',
        dueDate: '2026-12-19'
    };

    const editedTask: NewTask = {
        title: editedTaskTitle,
        description: 'Edited by Playwright automation',
        responsiblePerson: 'Edited Test User',
        status: 'In Progress',
        dueDate: '2027-12-21'
    };


    await page.goto('/');
    await expect(page).toHaveTitle('CommunityHub');

    await loginPage.login('admin', 'admin123');
    await expect(page.locator('#dashboard-view')).toBeVisible();

        // Create a new task first
    const response = await page.request.post('/api/tasks', { data: task });
    let responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.success).toBe(true);
    expect(typeof responseBody.task?.id).toBe('number');
    taskId = responseBody.task.id;


    await dashboardPage.navigateToTasks();
    await expect(page.locator('#tasks-section')).toBeVisible();


    try {
        await tasksPage.openEditForm(taskTitle);

        const responsePromise = page.waitForResponse(
            response => response.url().endsWith(`/api/tasks/${taskId}`) &&
                response.request().method() === 'PUT'
        )

        await tasksPage.editTask(taskTitle, editedTask);

        responseBody = undefined;
        const response = await responsePromise;
        expect(response.ok()).toBeTruthy();
        responseBody = await response.json();
        expect(typeof responseBody.task?.id).toBe('number');
        taskId = responseBody.task.id;

        await expect(page.locator('#tasks-list').getByText(editedTaskTitle, { exact: true })).toBeVisible();
    } finally {

        if (taskId !== undefined) {
            const deleteResponse = await page.request.delete(`/api/tasks/${taskId}`);
            expect(deleteResponse.ok()).toBeTruthy();
        }
    }







})
