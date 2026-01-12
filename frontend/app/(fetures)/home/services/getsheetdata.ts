import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function Getsheetdata() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/sheet/sheet/striversheetdata`,
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return { success: false, message: "Failed to fetch sheet data" };
  }
}

export async function trackUserVisit() {
  try {
    const indianDate = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });
    
    const response = await axios.post(
      `${API_BASE_URL}/user-activity/track-visit`,
      {
        date: indianDate
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking visit:', error);
    return null;
  }
}

export async function getUserActivity(year?: number) {
  try {
    const url = year 
      ? `${API_BASE_URL}/user-activity/activity?year=${year}`
      : `${API_BASE_URL}/user-activity/activity`;
      
    const response = await axios.get(url, {
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
}

export async function handelquestionClick(
  questionsNumber: string,
  difficulty: string,
  testData?: any[]
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sheet/add-question`,
      {
        sheetname: "striversheetdata",
        questionNumber: questionsNumber,
        difficulty: difficulty,
        Testdata: testData || null,
      },
      {
        withCredentials: true,
      }
    );

    return "Question updated successfully";
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return { success: false, message: "Failed to fetch sheet data" };
  }
}

export async function submitTestData(
  questionNumber: string,
  questionTitle: string,
  testData: any[]
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sheet/add-question`,
      {
        sheetname: "striversheetdata",
        questionNumber: questionNumber,
        Testdata: testData,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    return { success: false, message: "Failed to submit test data" };
  }
}

export async function handelNotepadClick(
  questionsNumber: string,
  noteText: string
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sheet/add-note`,
      {
        sheetname: "striversheetdata",
        questionNumber: questionsNumber,
        noteText: noteText,
      },
      {
        withCredentials: true,
      }
    );

    return "Note updated successfully";
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return { success: false, message: "Failed to fetch sheet data" };
  }
}

export async function handelBookmarkClick(questionsNumber: string) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sheet/add-bookmark`,
      {
        sheetname: "striversheetdata",
        questionNumber: questionsNumber,
      },
      {
        withCredentials: true,
      }
    );

    return "Bookmark updated successfully";
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return { success: false, message: "Failed to update bookmark" };
  }
}

export async function handelTimerClick(questionsNumber: string, time: number) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sheet/add-timer`,
      {
        sheetname: "striversheetdata",
        questionNumber: questionsNumber,
        time: time,
      },
      {
        withCredentials: true,
      }
    );

    return "Timer updated successfully";
  } catch (error) {
    console.error("Error updating timer:", error);
    return { success: false, message: "Failed to update timer" };
  }
}

export async function CreatePlaylist(playlistName: string, description: string, isPublic: boolean) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/playlist/create`,
      {
        playlistName: playlistName,
        description: description,
        isPublic: isPublic,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    return { success: false, message: "Failed to create playlist" };
  }
}

export async function AddQuestionToPlaylist(playlistId: string, sheetname: string, questionNumber: string, difficulty: string) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/playlist/add-question`,
      {
        playlistId: playlistId,
        sheetname: sheetname,
        questionNumber: questionNumber,
        difficulty: difficulty,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding question to playlist:", error);
    return { success: false, message: "Failed to add question to playlist" };
  }
}

export async function getUserNotesAndBookmarks() {
  try {
    const sheetData = await Getsheetdata();
    
    if (sheetData.success && sheetData.data?.sheet) {
      const userData = sheetData.data.sheet;
      return {
        success: true,
        notequestions: userData.notequestions || [],
        bookmarkedquestions: userData.bookmarkedquestions || [],
        solvedquestions: userData.solvedquestions || [],
        timers: userData.timers || []
      };
    }
    return { success: false, message: "No data found" };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false, message: "Failed to fetch user data" };
  }
}

export async function getAllPlaylists() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/playlist/all`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return { success: false, message: "Failed to fetch playlists" };
  }
}

export async function getPlaylistById(playlistId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/playlist/${playlistId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return { success: false, message: "Failed to fetch playlist" };
  }
}




export async function getLeaderboard() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/sheet/leaderboard`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Leaderboard:", error);
    return { success: false, message: "Failed to fetch leaderboard" };
  }
}
