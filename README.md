# DIZ-AI: AI-Powered Disaster Preparedness Platform

DIZ-AI is an intelligent emergency preparedness platform that provides personalized disaster readiness plans based on your location, household composition, and specific needs.

## Features

### Location-Based Analysis
- Geocoding with OpenCage API for precise location data
- Real-time weather conditions via OpenWeather API
- Comprehensive location analysis using Wolfram Alpha API
- Risk assessment for multiple disaster types

### Personalized Emergency Planning
- Custom emergency kit recommendations with shopping links
- Disaster-specific action plans (Before, During, After)
- Specialized recommendations based on household needs
- Budget-conscious supply lists with estimated costs

### Interactive Survey
- Multi-step form with progress tracking
- Household information collection
- Special needs accommodation
- Custom category creation
- Implementation timeline planning

### Comprehensive Results
- Summary dashboard with top risks
- Categorized emergency supplies checklist
- Detailed disaster response plans
- Universal and disaster-specific action steps
- Emergency contact information
- Printable report generation

### Resource Center
- Emergency contact directory
- Links to official disaster preparedness websites
- Local emergency service information

## Technical Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **APIs**:
  - OpenCage (Geocoding)
  - OpenWeather (Weather Data)
  - Wolfram Alpha (Location Analysis)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
OPENCAGE_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here
WOLFRAM_APP_ID=your_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── analyze/            # Survey form page
│   ├── analysis-result/    # Results display page
│   ├── resources/          # Resource directory
│   └── api/
│       └── analyze/        # Analysis endpoint
├── lib/
│   ├── geocoding.ts       # OpenCage API integration
│   ├── weather.ts         # OpenWeather API integration
│   └── wolfram.ts         # Wolfram Alpha API integration
```

## API Integrations

### OpenCage Geocoding
- Location validation and coordinates
- City, state, and postal code extraction

### OpenWeather
- Current weather conditions
- Temperature and humidity data
- Precipitation information

### Wolfram Alpha
- Geographical data analysis
- Natural disaster risk assessment
- Local emergency services information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Mission

To leverage artificial intelligence and data analytics to:
- Provide personalized disaster preparedness recommendations
- Help communities build resilience against natural disasters
- Make emergency planning more accessible and actionable
- Save lives through better preparation and informed decision-making

## 🚀 Features

- **AI-Powered Analysis**: Utilizes Wolfram Alpha for environmental data analysis and LLM models for personalized recommendations
- **Location-Specific Plans**: Tailored recommendations based on your exact location and its unique risks
- **Personalized Approach**: Considers household size, special needs, pets, and mobility requirements
- **Visual Learning**: Integrated disaster footage for better understanding and awareness
- **Comprehensive Planning**: Covers everything from emergency supplies to evacuation routes

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **AI/ML**: 
  - Wolfram Alpha API for environmental and geographical analysis
  - Large Language Models for personalized recommendations
- **Data Visualization**: Dynamic risk assessment displays
- **Backend**: Next.js API routes with TypeScript

## 🌟 Key Components

1. **Risk Analysis**
   - Location-based risk assessment
   - Environmental data analysis
   - Historical disaster data evaluation

2. **Personalized Planning**
   - Custom emergency supply lists
   - Evacuation route planning
   - Special needs considerations
   - Pet emergency planning

3. **Real-time Updates**
   - Environmental condition monitoring
   - Risk level updates
   - Emergency alerts integration

## 🚧 Project Status

This project is actively under development. Current focus areas:
- Enhancing AI recommendation accuracy
- Expanding location-specific data analysis
- Improving user interface and experience
- Adding more disaster types and scenarios

## 🤝 Contributing

We welcome contributions! If you're interested in helping make disaster preparedness more accessible and effective, please:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Wolfram Alpha for environmental data analysis
- Open-source AI community
- Disaster preparedness experts and organizations

---

*Built with ❤️ for community resilience and safety*
