import { IntroDoorGateway } from '../components/ui/IntroDoorGateway'
import { FeatureShowcase } from '../components/ui/FeatureShowcase'
import '../components/ui/FeatureShowcase.css'

export function HomePage() {
  return (
    <IntroDoorGateway>
      <FeatureShowcase />
    </IntroDoorGateway>
  )
}
