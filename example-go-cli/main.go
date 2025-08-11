package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

const baseURL = "http://localhost:3000"

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type Task struct {
	ID          string `json:"_id,omitempty"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

func main() {
	if len(os.Args) < 2 {
		printUsage()
		return
	}

	command := os.Args[1]

	switch command {
	case "register":
		if len(os.Args) < 5 {
			fmt.Println("Usage: todo register <name> <email> <password>")
			return
		}
		register(os.Args[2], os.Args[3], os.Args[4])
	case "login":
		if len(os.Args) < 4 {
			fmt.Println("Usage: todo login <email> <password>")
			return
		}
		login(os.Args[2], os.Args[3])
	case "add":
		if len(os.Args) < 4 {
			fmt.Println("Usage: todo add <token> <description>")
			return
		}
		addTask(os.Args[2], os.Args[3])
	case "list":
		if len(os.Args) < 3 {
			fmt.Println("Usage: todo list <token>")
			return
		}
		listTasks(os.Args[2])
	case "complete":
		if len(os.Args) < 4 {
			fmt.Println("Usage: todo complete <token> <task_id>")
			return
		}
		completeTask(os.Args[2], os.Args[3])
	default:
		printUsage()
	}
}

func printUsage() {
	fmt.Println("Todo CLI - A Go client for the Todo Backend API")
	fmt.Println("\nCommands:")
	fmt.Println("  register <name> <email> <password>  - Create a new account")
	fmt.Println("  login <email> <password>            - Login and get token")
	fmt.Println("  add <token> <description>           - Add a new task")
	fmt.Println("  list <token>                        - List all tasks")
	fmt.Println("  complete <token> <task_id>          - Mark task as complete")
}

func register(name, email, password string) {
	user := User{Name: name, Email: email, Password: password}
	jsonData, _ := json.Marshal(user)

	resp, err := http.Post(baseURL+"/users", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	
	if resp.StatusCode == 201 {
		var result map[string]interface{}
		json.Unmarshal(body, &result)
		fmt.Printf("Registration successful!\nToken: %v\n", result["token"])
	} else {
		fmt.Printf("Registration failed: %s\n", body)
	}
}

func login(email, password string) {
	loginData := map[string]string{"email": email, "password": password}
	jsonData, _ := json.Marshal(loginData)

	resp, err := http.Post(baseURL+"/users/login", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	
	if resp.StatusCode == 200 {
		var result map[string]interface{}
		json.Unmarshal(body, &result)
		fmt.Printf("Login successful!\nToken: %v\n", result["token"])
	} else {
		fmt.Printf("Login failed: %s\n", body)
	}
}

func addTask(token, description string) {
	task := Task{Description: description, Completed: false}
	jsonData, _ := json.Marshal(task)

	req, _ := http.NewRequest("POST", baseURL+"/tasks", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	
	if resp.StatusCode == 201 {
		var task Task
		json.Unmarshal(body, &task)
		fmt.Printf("Task added successfully!\nID: %s\nDescription: %s\n", task.ID, task.Description)
	} else {
		fmt.Printf("Failed to add task: %s\n", body)
	}
}

func listTasks(token string) {
	req, _ := http.NewRequest("GET", baseURL+"/tasks", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	
	if resp.StatusCode == 200 {
		var tasks []Task
		json.Unmarshal(body, &tasks)
		
		fmt.Println("\nYour Tasks:")
		fmt.Println("===========")
		for i, task := range tasks {
			status := "[ ]"
			if task.Completed {
				status = "[X]"
			}
			fmt.Printf("%d. %s %s (ID: %s)\n", i+1, status, task.Description, task.ID)
		}
	} else {
		fmt.Printf("Failed to get tasks: %s\n", body)
	}
}

func completeTask(token, taskID string) {
	updateData := map[string]bool{"completed": true}
	jsonData, _ := json.Marshal(updateData)

	req, _ := http.NewRequest("PATCH", baseURL+"/tasks/"+taskID, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		fmt.Println("Task marked as complete!")
	} else {
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Printf("Failed to update task: %s\n", body)
	}
}