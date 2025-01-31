package main

import "fmt"

func main() {
	type Person struct {
		name string
	}

	p := Person{name: "Leonardo"}
	pp := &p
	fmt.Println(p, &p, p, p.name)
	fmt.Println(pp, *pp, &pp, pp.name)
}
