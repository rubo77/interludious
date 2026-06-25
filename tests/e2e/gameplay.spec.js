import { test, expect } from '@playwright/test';

test.describe('Gameplay E2E Tests', () => {
  test('should load the game page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Interludious/);
  });

  test('should display main menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Start Game')).toBeVisible();
  });

  test('should start game when clicking start button', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Game');
    // Game should transition to playing state
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should display HUD during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Game');
    // HUD should show score, lives, fuel
    await expect(page.locator('text=Score')).toBeVisible();
  });

  test('should handle keyboard input', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Game');
    
    // Press arrow keys
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    
    // Game should still be running
    await expect(page.locator('canvas')).toBeVisible();
  });
});
