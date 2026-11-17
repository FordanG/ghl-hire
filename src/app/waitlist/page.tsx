import { redirect } from 'next/navigation';

// The waitlist is closed: the board is open. Old links land on the signup form.
export default function WaitlistPage() {
  redirect('/#subscribe');
}
