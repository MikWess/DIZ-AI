# DIZ-AI: Emergency Preparedness AI Assistant

An AI-powered emergency preparedness application that provides personalized disaster risk analysis and preparation recommendations based on your location.

## Features

- Location-based disaster risk analysis using Wolfram Alpha for environmental data
- Customized emergency preparation plans
- Interactive disaster type information
- Emergency kit recommendations with shopping links
- Evacuation route planning
- Emergency contact management
- Printable preparation reports

## Technologies Used

### Programming Languages
- TypeScript
- JavaScript
- HTML
- CSS

### Frameworks/Libraries
- React
- Next.js (App Router)
- Tailwind CSS

### APIs/Services
- Wolfram Alpha API (for environmental and geographical analysis)
- OpenAI API (for risk analysis and recommendations)
- Anthropic API (for alternative AI processing)
- Replicate API (Stable Diffusion)
- Deepgram API
- Firebase
  - Authentication
  - Database
  - Storage

### Development Tools
- Vercel AI SDK
- TypeScript compiler
- Node.js/npm

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
# AI Services
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_key_here
DEEPGRAM_API_KEY=your_key_here

# Wolfram Alpha
WOLFRAM_APP_ID=your_app_id_here

# Firebase Configuration
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_domain_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/app/components` - React components
- `/src/app/lib` - Utility functions, hooks, and contexts
  - `/src/app/lib/wolfram` - Wolfram Alpha API integration
- `/src/app/api` - API route handlers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
    - Location elevation data
    - Seismic activity analysis
    - Weather patterns
    - Geographical risk factors
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
