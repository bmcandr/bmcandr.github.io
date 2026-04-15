import { describe, test, expect } from 'vitest';
import { projects } from '../projects.js';

describe('projects data', () => {
  test('is an array', () => {
    expect(Array.isArray(projects)).toBe(true);
  });

  test('each project has required fields', () => {
    projects.forEach((p) => {
      expect(p).toHaveProperty('slug');
      expect(typeof p.slug).toBe('string');
      expect(p).toHaveProperty('title');
      expect(typeof p.title).toBe('string');
      expect(p).toHaveProperty('description');
      expect(typeof p.description).toBe('string');
      expect(p).toHaveProperty('tech');
      expect(Array.isArray(p.tech)).toBe(true);
    });
  });

  test('optional snippet has code and lang if present', () => {
    projects.forEach((p) => {
      if (p.snippet) {
        expect(p.snippet).toHaveProperty('code');
        expect(p.snippet).toHaveProperty('lang');
      }
    });
  });
});
