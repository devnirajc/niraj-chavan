/**
 * Components available inside every MDX entry without an import:
 *   <Draft>, <Callout>, <Steps>, <Figure>.
 * Pages pass this map to <Content components={mdxComponents} />.
 */
import Draft from './Draft.astro';
import Callout from './Callout.astro';
import Figure from './Figure.astro';
import Steps from '@/components/ui/Steps.astro';

export const mdxComponents = { Draft, Callout, Steps, Figure };
