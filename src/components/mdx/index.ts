/**
 * Components available inside every MDX entry without an import:
 *   <Draft>, <Callout>, <Steps>, <Figure>, <Decisions>.
 * Markdown links render through Link, so off-site ones open in a new tab.
 * Pages pass this map to <Content components={mdxComponents} />.
 */
import Draft from './Draft.astro';
import Callout from './Callout.astro';
import Figure from './Figure.astro';
import Link from './Link.astro';
import Steps from '@/components/ui/Steps.astro';
import Decisions from '@/components/content/DecisionLog.astro';

export const mdxComponents = { Draft, Callout, Steps, Figure, Decisions, a: Link };
