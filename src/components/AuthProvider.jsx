import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        try {
            const { data } = await api.get('/api/users');
            setUserProfile(data);
            setProfileExists(true);
            return data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            const emptyProfile = {
                name: "",
                gender: "",
                age: null,
                location: "",
                profile_pic_url: ""
            };
            setUserProfile(emptyProfile);
            setProfileExists(false);
            return emptyProfile;
        }
    }, []);

    const createOrUpdateUserProfile = useCallback(async (profileData, file) => {
        if (!auth.currentUser) throw new Error("User is not authenticated.");

        let profilePicUrl = profileData.profile_pic_url || "";

        try {
            if (file) {
                const userId = auth.currentUser.uid;
                const imageRef = ref(storage, `users/${userId}/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                profilePicUrl = await getDownloadURL(response.ref);
            }

            const fullData = {
                ...profileData,
                profile_pic_url: profilePicUrl,
            };

            const method = profileExists ? api.put : api.post;
            const endpoint = '/api/users/';
            await method(endpoint, fullData);

            const updatedProfile = await fetchUserProfile();
            return updatedProfile;
        } catch (error) {
            console.error("Error saving profile:", error);
            throw error;
        }
    }, [profileExists, fetchUserProfile]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    const token = await user.getIdToken(true);
                    localStorage.setItem('token', token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    setCurrentUser(user);
                    await fetchUserProfile();
                } else {
                    setCurrentUser(null);
                    setUserProfile(null);
                    setProfileExists(false);
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                }
            } catch (error) {
                console.error("Error during authentication:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [fetchUserProfile]);

    const combinedUser = useMemo(() => {
        if (currentUser && userProfile) {
            return { ...currentUser, ...userProfile, profileExists };
        }
        return currentUser;
    }, [currentUser, userProfile, profileExists]);

    const isProfileComplete = useMemo(() => {
        return userProfile &&
            userProfile.name &&
            userProfile.gender &&
            userProfile.age !== null &&
            userProfile.location;
    }, [userProfile]);

    const value = useMemo(() => ({
        currentUser: combinedUser,
        fetchUserProfile,
        createOrUpdateUserProfile,
        profileExists,
        isProfileComplete,
        loading
    }), [combinedUser, fetchUserProfile, createOrUpdateUserProfile, profileExists, isProfileComplete, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
