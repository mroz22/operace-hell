export const UNDETECTABLE = 'undetectable';
export const LOW = 'low';
export const MEDIUM = 'medium';
export const HIGH = 'high';
export const CRITICAL = 'critical';

export const getRadiationLevel = (value) => {
  if (value < 10) {
    return UNDETECTABLE;
  }
  if (value < 50) {
    return LOW;
  }
  if (value < 200) {
    return MEDIUM;
  }
  if (value < 300) {
    return HIGH;
  }
  return CRITICAL;
};

export const getRadiationInfo = (value) => {
  if (!value) {
    throw new Error('cant be used without value');
  }
  const level = getRadiationLevel(value);
  switch (level) {
    case UNDETECTABLE:
      return { text: 'podprahová míra ozáření', color: 'green' };
    case LOW:
      return { text: 'mírné ozáření', color: 'green' };
    case MEDIUM:
      return { text: 'střední ozáření', color: 'orange' };
    case HIGH:
      return { text: 'vysoké ozáření', color: 'red' };
    case CRITICAL:
      return { text: 'extrémní ozáření', color: 'red' };
    // no default
  }
};

export const getDoseInfo = (value) => {
  if (!value) {
    throw new Error('cant be used without value');
  }
  const level = getRadiationLevel(value);
  switch (level) {
    case UNDETECTABLE:
      return { text: 'nedetekovatelná míra záření', color: 'green' };
    case LOW:
      return { text: 'mírné záření', color: 'green' };
    case MEDIUM:
      return { text: 'střední záření', color: 'orange' };
    case HIGH:
      return { text: 'vysoké záření', color: 'red' };
    case CRITICAL:
      return { text: 'extrémní záření', color: 'red' };
      // no default
  }
};
