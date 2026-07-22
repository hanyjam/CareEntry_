import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAnamnesePDF } from '../pdfGenerator';

const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetFont = vi.fn();
const mockSplitTextToSize = vi.fn((text) => [text]);
const mockAddPage = vi.fn();
const mockSetLineWidth = vi.fn();
const mockLine = vi.fn();

vi.mock('jspdf', () => ({
  default: class {
    constructor() {
      this.save = mockSave;
      this.text = mockText;
      this.setFontSize = mockSetFontSize;
      this.setFont = mockSetFont;
      this.splitTextToSize = mockSplitTextToSize;
      this.addPage = mockAddPage;
      this.setLineWidth = mockSetLineWidth;
      this.line = mockLine;
    }
  }
}));

describe('PDF Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates PDF with form data', () => {
    const formData = {
      vorname: 'Max',
      nachname: 'Mustermann',
      geburtsdatum: '1990-01-01',
      geschlecht: 'männlich',
      email: 'max@test.de',
      telefon: '0123456789',
    };
    
    expect(() => generateAnamnesePDF(formData)).not.toThrow();
    expect(mockSave).toHaveBeenCalled();
  });

  it('handles missing data gracefully', () => {
    const incompleteData = {
      vorname: 'Max',
    };
    
    expect(() => generateAnamnesePDF(incompleteData)).not.toThrow();
    expect(mockSave).toHaveBeenCalled();
  });
});