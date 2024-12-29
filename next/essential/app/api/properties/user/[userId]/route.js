import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/user/:[userId]
export const GET = async (request, { params }) => {
    try {
        await connectDB();
        const userId = params.userId;

        if (!userId) {
            return new Response('User not found', { status: 404 });
        }

        console.log('UserId:', userId);

        // Querying the database directly with the [userId]
        const userProperties = await Property.find({ owner: userId });
        console.log('User Properties:', userProperties);

        if (userProperties.length === 0) {
            console.log('No properties found for the given [userId]');
            return new Response('No properties found', { status: 404 });
        }

        return new Response(JSON.stringify(userProperties), { status: 200 });
    } catch (error) {
        console.error('Error:', error.message);
        return new Response('An error occurred', { status: 500, body: error.message });
    }
};