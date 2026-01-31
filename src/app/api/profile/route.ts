
import { BusinessProfile } from '@/types';

export async function POST(request: Request) {
  try {
    const profile: BusinessProfile = await request.json();

    // Validate and save profile to storage (in prod: database)
    if (!profile.name || !profile.industry) {
      return Response.json({ error: 'Invalid profile' }, { status: 400 });
    }

    // Simulate database save
    const savedProfile = {
      ...profile,
      id: profile.id || crypto.randomUUID(),
      createdAt: new Date(),
    };

    return Response.json(savedProfile);
  } catch (error) {
    return Response.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
