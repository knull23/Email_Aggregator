export const getRelevantDocuments = async (emailContent: string): Promise<string[]> => {
    // In practice: embed emailContent, query vector DB, return matching docs.
    // Here we return a static example:
    return [
      'Our product is Onebox, an AI-powered email aggregator that syncs IMAP in real-time.',
      'If the lead is interested, share the meeting booking link: https://cal.com/example'
    ];
  };
  