import requests
import os

def download_file(url, save_path):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            with open(save_path, 'wb') as file:
                file.write(response.content)
            print(f"File downloaded successfully: {save_path}")
        else:
            print(f"Failed to download file, status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    url = "https://qubstudentcloud-my.sharepoint.com//personal//1324764_ads_qub_ac_uk//_layouts//15//download.aspx?UniqueId=%7B0a91ec72%2D9ee2%2D47df%2D9314%2De6a2a70df4a8%7D"  # Replace with your URL
    save_path = "C:/path/to/save/file.ext"        # Replace with desired local path

    script_dir = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(script_dir, "Year1_FoCS_Timetable.xlsx")  # Replace with desired file name

    download_file(url, save_path)
