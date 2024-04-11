import { AddressSection } from './address-section';
import { Container } from '../../ui/container';
import { ExpectedEvents } from './expected-events';
import { EventInfo } from './event-info';

export default function Event() {
  return (
    <Container>
      <EventInfo />
      <AddressSection />
      <ExpectedEvents />
    </Container>
  );
}
