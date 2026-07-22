import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload Component', () => {
  it('renders file upload button', () => {
    render(<FileUpload onUpload={vi.fn()} />);
    
    const uploadText = screen.getByText(/klicken sie hier/i);
    expect(uploadText).toBeInTheDocument();
  });

  it('shows error for too large file', () => {
    render(<FileUpload maxSizeMB={1} onUpload={vi.fn()} />);
    
    const input = document.querySelector('input[type="file"]');
    
    const largefile = new File(['a'.repeat(2000000)], 'large.pdf', {
      type: 'application/pdf',
    });
    
    fireEvent.change(input, { target: { files: [largefile] } });
    
    expect(screen.getByText(/datei ist zu groß/i)).toBeInTheDocument();
  });

  it('accepts valid file types', () => {
    render(<FileUpload acceptedTypes=".pdf,.jpg" onUpload={vi.fn()} />);
    
    const input = document.querySelector('input[type="file"]');
    
    const validFile = new File(['content'], 'test.pdf', {
      type: 'application/pdf',
    });
    
    fireEvent.change(input, { target: { files: [validFile] } });
    
    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
  });
});