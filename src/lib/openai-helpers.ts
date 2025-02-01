interface ProcessedRiskAnalysis {
  activeDisasters: string[];
  riskExplanations: {
    high: { disaster: string; explanation: string }[];
    medium: { disaster: string; explanation: string }[];
    low: { disaster: string; explanation: string }[];
  };
}

export function processRiskAnalysis(analysisText: string): ProcessedRiskAnalysis {
  // Split the analysis into sections for each disaster
  const sections = analysisText.split(/\n\n/);
  
  const result: ProcessedRiskAnalysis = {
    activeDisasters: [],
    riskExplanations: {
      high: [],
      medium: [],
      low: []
    }
  };

  sections.forEach(section => {
    // Extract disaster type and risk level using regex
    const disasterMatch = section.match(/^(.*?)(?::|-).*?(high|medium|low)/i);
    if (disasterMatch) {
      const [, disaster, risk] = disasterMatch;
      const explanation = section.replace(/^.*?:/, '').trim();
      
      result.activeDisasters.push(disaster.toLowerCase().trim());
      result.riskExplanations[risk.toLowerCase() as 'high' | 'medium' | 'low'].push({
        disaster: disaster.trim(),
        explanation
      });
    }
  });

  return result;
}

interface ProcessedPreparations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  supplies: {
    category: string;
    items: { name: string; priority: 'high' | 'medium' | 'low' }[];
  }[];
}

export function processPreparations(preparationsText: string): ProcessedPreparations {
  const sections = preparationsText.split(/\d+\./);
  
  return {
    immediate: extractListItems(sections[1] || ''),
    shortTerm: extractListItems(sections[2] || ''),
    longTerm: extractListItems(sections[3] || ''),
    supplies: processSuppliesList(sections[4] || '')
  };
}

function extractListItems(text: string): string[] {
  return text
    .split(/\n/)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);
}

function processSuppliesList(text: string): {
  category: string;
  items: { name: string; priority: 'high' | 'medium' | 'low' }[];
}[] {
  // Split into categories and process each
  const categories = text.split(/Category:|Type:/i).filter(Boolean);
  
  return categories.map(category => {
    const [categoryName, ...items] = category.split('\n').filter(Boolean);
    return {
      category: categoryName.trim(),
      items: items.map(item => ({
        name: item.replace(/^[-•*]\s*/, '').trim(),
        priority: determinePriority(item)
      }))
    };
  });
}

function determinePriority(item: string): 'high' | 'medium' | 'low' {
  const text = item.toLowerCase();
  if (text.includes('critical') || text.includes('essential') || text.includes('immediate')) {
    return 'high';
  }
  if (text.includes('recommended') || text.includes('important')) {
    return 'medium';
  }
  return 'low';
} 