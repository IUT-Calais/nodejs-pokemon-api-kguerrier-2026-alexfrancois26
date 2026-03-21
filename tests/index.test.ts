import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Index', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.resetModules();
  });

  it('export app', async () => {
    const { app } = await import('../src/index.js');
    expect(app).toBeDefined();
    expect(app._router).toBeDefined();
  });

  it('export stopServer', async () => {
    const { stopServer } = await import('../src/index.js');
    expect(stopServer).toBeDefined();
    expect(typeof stopServer).toBe('function');
  });

  it('start server in production', async () => {
    process.env.NODE_ENV = 'production';
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const module = await import('../src/index.js');
    
    expect(module.server).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('🚀 Serveur lancé sur')
    );
    
    // Call stopServer to cover lines 32-33
    module.stopServer();
    
    consoleSpy.mockRestore();
  });

  it('handle stopServer when no server', async () => {
    const { stopServer } = await import('../src/index.js');
    // Call stopServer without a server (should not throw)
    expect(() => stopServer()).not.toThrow();
  });
});

