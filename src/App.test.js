import React from 'react';
import axios from 'axios';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('axios');

describe('Weather App', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it('should display weather information after submitting location', async () => {
    const { getByTestId } = render(<App />);

    const locationInput = getByTestId('location-input');
    const searchButton = getByTestId('search-button');

    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.click(searchButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/dev/weather', {
      location: 'New York',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const response = {
      data: {
        image: 'https://example.com/image.png',
        location: 'New York',
        weather: 'Sunny',
      },
    };

    axios.post.mockResolvedValueOnce(response);

    await waitFor(() => {
      expect(getByTestId('search-results')).toBeInTheDocument();
      expect(getByTestId('search-results-weather')).toBeInTheDocument();
      expect(getByTestId('search-results-weather').querySelector('img')).toHaveAttribute('src', response.data.image);
      expect(getByTestId('search-results-weather')).toHaveTextContent('Location: New York');
      expect(getByTestId('search-results-weather')).toHaveTextContent('Weather: Sunny');
    });
  });

  it('should display error message for invalid location', async () => {
    const { getByTestId, getByText, queryByTestId } = render(<App />);

    const locationInput = getByTestId('location-input');
    const searchButton = getByTestId('search-button');

    fireEvent.change(locationInput, { target: { value: 'Invalid Location' } });
    fireEvent.click(searchButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/dev/weather', {
      location: 'Invalid Location',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    axios.post.mockRejectedValueOnce(new Error('Failed to fetch weather data'));

    await waitFor(() => {
      expect(queryByTestId('search-results')).toBeNull();
      expect(getByText('No weather data found for the given location.')).toBeInTheDocument();
    });
  });
});

