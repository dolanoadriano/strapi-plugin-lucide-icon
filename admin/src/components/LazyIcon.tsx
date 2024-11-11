import React, { lazy, Suspense, useMemo } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>;

type Key = keyof typeof dynamicIconImports;

interface LazyIconProps extends Omit<LucideProps, 'ref'> {
  name: Key | (string & {});
  className?: string;
  style?: React.CSSProperties;
}

// Pamięć podręczna na załadowane komponenty
const iconCache: Record<string, React.ComponentType<LucideProps>> = {};

const LazyIcon = ({ name, ...props }: LazyIconProps) => {
  const key = name && name in dynamicIconImports ? name as Key : undefined;
  if (!key) return null;

  // Użycie `useMemo` dla ikony, aby pamiętać załadowany komponent
  const LucideIcon = useMemo(() => {
    if (!iconCache[key]) {
      // @ts-expect-error
      iconCache[key] = lazy(dynamicIconImports[key]);
    }
    return iconCache[key];
  }, [key]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default LazyIcon;
